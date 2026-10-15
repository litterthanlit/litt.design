import { getContributions } from "@/lib/github-contributions";

// Monochrome steps on litt tokens, from the lowest surface up to the foreground.
// Written out in full so Tailwind can see every class. Square cells, no radius.
const LEVEL_CLASS = [
  "bg-litt-surface-3",
  "bg-[color-mix(in_oklab,var(--litt-fg)_22%,var(--litt-surface-3))]",
  "bg-[color-mix(in_oklab,var(--litt-fg)_45%,var(--litt-surface-3))]",
  "bg-[color-mix(in_oklab,var(--litt-fg)_70%,var(--litt-surface-3))]",
  "bg-litt-fg",
];

const MOBILE_WEEKS = 26; // phones show the last ~6 months

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDay(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export async function ContributionGraph({ username }: { username: string }) {
  const calendar = await getContributions(username);
  if (!calendar) return null;

  const { total, weeks } = calendar;
  const firstMobileWeek = Math.max(0, weeks.length - MOBILE_WEEKS);
  const totalLabel = total.toLocaleString("en-US");

  return (
    <section id="activity" aria-labelledby="activity-heading" className="section">
      <div className="shell">
        <div className="split">
          <div className="split-label">
            <h2 id="activity-heading" className="text-litt-h4 text-litt-fg">
              Building in public
            </h2>
            <p className="meta mt-2">
              <span className="text-litt-fg">{totalLabel}</span> contributions in the last year
            </p>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-2 inline-flex min-h-8 items-center text-litt-small pointer-coarse:min-h-litt-control-md"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <div className="split-body">
            <div
              role="img"
              aria-label={`GitHub contribution graph: ${totalLabel} contributions in the last year.`}
              className="flex gap-1"
            >
              {weeks.map((week, i) => {
                const monthStart = week.find((day) => day.date.endsWith("-01"));
                return (
                  <div
                    key={week[0].date}
                    className={`min-w-0 flex-1 flex-col ${i < firstMobileWeek ? "hidden sm:flex" : "flex"}`}
                  >
                    <span className="meta mb-2 block h-4 whitespace-nowrap">
                      {monthStart ? MONTHS[Number(monthStart.date.slice(5, 7)) - 1] : ""}
                    </span>
                    <div className="grid grid-rows-7 gap-1">
                      {week.map((day) => (
                        <span
                          key={day.date}
                          title={`${day.count === 0 ? "No" : day.count} contribution${
                            day.count === 1 ? "" : "s"
                          } on ${formatDay(day.date)}`}
                          className={`aspect-square w-full ${LEVEL_CLASS[day.level]}`}
                          style={{ gridRow: new Date(`${day.date}T00:00:00Z`).getUTCDay() + 1 }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="meta mt-4 flex items-center justify-between gap-4">
              <span className="sm:hidden">Last 6 months</span>
              <span className="ml-auto flex items-center gap-2" aria-hidden="true">
                Less
                {LEVEL_CLASS.map((level) => (
                  <span key={level} className={`size-3 ${level}`} />
                ))}
                More
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
