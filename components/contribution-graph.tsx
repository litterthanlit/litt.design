import { getContributions } from "@/lib/github-contributions";

// Monochrome ink scale to match the rest of the site
const LEVEL_COLORS = [
  "rgba(10,10,10,0.06)",
  "rgba(10,10,10,0.2)",
  "rgba(10,10,10,0.4)",
  "rgba(10,10,10,0.65)",
  "rgba(10,10,10,0.9)",
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
    <section
      id="activity"
      aria-labelledby="activity-heading"
      className="section-shell py-16 md:py-20"
    >
      {/* Capped width keeps the squares near GitHub's own ~10px size */}
      <div className="max-w-[720px]">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 id="activity-heading" className="eyebrow">
            Building in public
          </h2>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[#737373] transition-colors duration-150 hover:text-[#0a0a0a]"
          >
            GitHub ↗
          </a>
        </div>

        <p className="mb-5 text-[15px] font-medium tracking-[-0.01em] text-[#0a0a0a]">
          {totalLabel} contributions in the last year
        </p>

        <div
          role="img"
          aria-label={`GitHub contribution graph: ${totalLabel} contributions in the last year.`}
          className="flex gap-[2px]"
        >
          {weeks.map((week, i) => {
            const monthStart = week.find((day) => day.date.endsWith("-01"));
            return (
              <div
                key={week[0].date}
                className={`min-w-0 flex-1 flex-col ${
                  i < firstMobileWeek ? "hidden md:flex" : "flex"
                }`}
              >
                <span className="mb-2 h-3 overflow-visible whitespace-nowrap font-mono text-[10px] leading-none text-[#737373]">
                  {monthStart ? MONTHS[Number(monthStart.date.slice(5, 7)) - 1] : ""}
                </span>
                <div className="grid grid-rows-7 gap-[2px]">
                  {week.map((day) => (
                    <span
                      key={day.date}
                      title={`${day.count === 0 ? "No" : day.count} contribution${
                        day.count === 1 ? "" : "s"
                      } on ${formatDay(day.date)}`}
                      className="aspect-square w-full rounded-[2px]"
                      style={{
                        gridRow: new Date(`${day.date}T00:00:00Z`).getUTCDay() + 1,
                        background: LEVEL_COLORS[day.level],
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[11px] text-[#737373]">
          <span className="md:hidden">Last 6 months</span>
          <span className="hidden md:inline">Last 12 months</span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            Less
            {LEVEL_COLORS.map((color) => (
              <span
                key={color}
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ background: color }}
              />
            ))}
            More
          </span>
        </div>
      </div>
    </section>
  );
}
