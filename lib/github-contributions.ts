export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendar = {
  total: number;
  // Columns of up to 7 days, Sunday first — same layout as GitHub
  weeks: ContributionDay[][];
};

const REVALIDATE_SECONDS = 60 * 60 * 24; // refresh once a day

const GRAPHQL_LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/**
 * Fetches the public contribution calendar for the last year.
 * Uses the GraphQL API when GITHUB_TOKEN is set (most reliable), falling
 * back to the public profile calendar if there's no token or it fails. Returns null on any failure so the
 * page can simply leave the section out.
 */
export async function getContributions(
  username: string,
): Promise<ContributionCalendar | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const days =
      (token ? await fromGraphQL(username, token).catch(() => null) : null) ??
      (await fromProfilePage(username));
    if (!days || days.days.length === 0) return null;
    return { total: days.total, weeks: groupIntoWeeks(days.days) };
  } catch {
    return null;
  }
}

async function fromGraphQL(username: string, token: string) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { date contributionCount contributionLevel } }
            }
          }
        }
      }`,
      variables: { login: username },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;

  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  const days: ContributionDay[] = [];
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      days.push({
        date: day.date,
        count: day.contributionCount,
        level: GRAPHQL_LEVELS[day.contributionLevel] ?? 0,
      });
    }
  }
  return { total: calendar.totalContributions as number, days };
}

async function fromProfilePage(username: string) {
  const res = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions`,
    {
      headers: { "User-Agent": "litt.design" },
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );
  if (!res.ok) return null;
  return parseContributionsHtml(await res.text());
}

function attr(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

export function parseContributionsHtml(html: string) {
  // Tooltips carry the exact counts, keyed by the id of the day cell
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)) {
    const id = attr(match[1], "for");
    const text = match[2].trim();
    if (!id) continue;
    const n = text.match(/^([\d,]+) contributions?/);
    counts.set(id, n ? Number(n[1].replace(/,/g, "")) : 0);
  }

  const days: ContributionDay[] = [];
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g)) {
    const tag = match[0];
    const date = attr(tag, "data-date");
    const level = Number(attr(tag, "data-level") ?? 0);
    if (!date) continue;
    const id = attr(tag, "id");
    days.push({
      date,
      count: (id && counts.get(id)) || 0,
      level: Math.min(4, Math.max(0, level)) as ContributionDay["level"],
    });
  }

  const heading = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
  const total = heading
    ? Number(heading[1].replace(/,/g, ""))
    : days.reduce((sum, d) => sum + d.count, 0);

  return { total, days };
}

function groupIntoWeeks(days: ContributionDay[]): ContributionDay[][] {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: ContributionDay[][] = [];
  for (const day of sorted) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 || weeks.length === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
  }
  return weeks;
}
