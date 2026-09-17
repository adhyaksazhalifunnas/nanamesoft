/**
 * SkillsTimeline — US-06.
 *
 * §5.5 budgets this as a Client Component for "filter state, keyboard nav".
 * Neither is needed: filtering is US-17 (P2, and explicitly not worth building
 * below eight projects), and keyboard navigation here is just links inside a
 * list, which is native. So this is a Server Component and ships no JavaScript.
 *
 * AC-06.3 is the load-bearing constraint. The horizontal bars below are a TIME
 * AXIS — they show the years a skill has been in use, against a labelled year
 * scale shared by every row. They are explicitly NOT proficiency bars, which
 * §11.2 bans: proficiency is the four-word vocabulary, rendered as text, with
 * its definitions published on the page (AC-06.2).
 *
 * The signature moment (§11.6 budgets exactly one) is here: the axis draws
 * itself and each era bar follows in sequence, once, when the section first
 * enters view. It communicates real structure — the passage of time — which is
 * the test §11.6 sets for whether motion earns its place. The transitions are
 * transform-only and fire from the same IntersectionObserver as Reveal, so the
 * sequence never replays on the way back up.
 *
 * AC-06.6: below 768px the bars are hidden entirely and the same data reads as
 * a grouped list with "since YYYY". Nothing is lost, and there is no horizontal
 * scrolling.
 */
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { SKILL_LEVELS, SKILL_LEVEL_DEFINITIONS } from "@/lib/schemas";
import type { Skill, SkillGroup } from "@/lib/schemas";

type SkillsTimelineProps = {
  groups: SkillGroup[];
  range: { from: number; to: number };
};

/** Level is communicated by text AND by weight — never by colour alone (AC-14.9). */
const LEVEL_STYLE: Record<Skill["level"], string> = {
  learning: "text-ink-subtle",
  working: "text-ink-muted",
  proficient: "text-ink font-medium",
  deep: "text-accent font-medium",
};

function yearTicks(from: number, to: number): number[] {
  const span = to - from;
  const step = span > 8 ? 2 : 1;
  const ticks: number[] = [];
  for (let y = from; y <= to; y += step) ticks.push(y);
  if (ticks.at(-1) !== to) ticks.push(to);
  return ticks;
}

export function SkillsTimeline({ groups, range }: SkillsTimelineProps) {
  const span = Math.max(1, range.to - range.from);
  const ticks = yearTicks(range.from, range.to);

  return (
    <div>
      {/* The year axis. aria-hidden because every row states its own years in
          text — this is a visual aid, not the information itself. */}
      <Reveal>
        <div
          aria-hidden="true"
          className="skills-axis relative mb-[var(--space-5)] hidden h-[var(--space-5)] md:block"
        >
          <div className="skills-axis-line bg-rule absolute inset-x-0 top-0 h-px" />
          {ticks.map((year) => (
            <span
              key={year}
              className="tabular text-2xs text-ink-subtle absolute top-[var(--space-2)] -translate-x-1/2"
              style={{ left: `${((year - range.from) / span) * 100}%` }}
            >
              {year}
            </span>
          ))}
        </div>
      </Reveal>

      <div className="space-y-[var(--space-7)]">
        {groups.map((group, groupIndex) => (
          <Reveal key={group.category} index={groupIndex}>
            <section aria-labelledby={`skills-${group.category}`}>
              <h3
                id={`skills-${group.category}`}
                className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase"
              >
                {group.label}
              </h3>

              <ul className="mt-[var(--space-4)] space-y-[var(--space-4)] md:space-y-[var(--space-3)]">
                {group.skills.map((skill, skillIndex) => {
                  const start = ((skill.firstUsed - range.from) / span) * 100;
                  const end = (((skill.lastUsed ?? range.to) - range.from) / span) * 100;

                  return (
                    <li
                      key={skill.id}
                      className="md:grid md:grid-cols-12 md:items-baseline md:gap-[var(--space-4)]"
                    >
                      <div className="md:col-span-4">
                        <span className="text-base">{skill.name}</span>{" "}
                        <span className={`text-xs ${LEVEL_STYLE[skill.level]}`}>
                          {skill.level}
                        </span>
                        <span className="tabular text-ink-subtle ml-[var(--space-2)] text-xs">
                          since {skill.firstUsed}
                          {skill.lastUsed ? `–${skill.lastUsed}` : ""}
                        </span>
                      </div>

                      {/* The era bar. Hidden below md (AC-06.6). */}
                      <div
                        aria-hidden="true"
                        className="bg-rule relative hidden h-px md:col-span-8 md:block"
                      >
                        <span
                          className="skill-era bg-accent absolute top-1/2 h-0.5 -translate-y-1/2"
                          style={
                            {
                              left: `${start}%`,
                              width: `${Math.max(1.5, end - start)}%`,
                              // Capped at six steps so the sequence never
                              // drags (§11.6).
                              "--era-index": Math.min(skillIndex, 5),
                            } as React.CSSProperties
                          }
                        />
                      </div>

                      {skill.note ? (
                        <p className="text-ink-subtle mt-[var(--space-1)] text-xs md:col-span-12">
                          {skill.note}
                        </p>
                      ) : null}

                      {/* AC-06.4: proficient and deep must cite evidence. The
                          schema enforces that they do; this renders it. */}
                      {skill.projects.length > 0 ? (
                        <p className="mt-[var(--space-1)] text-xs md:col-span-12">
                          <span className="text-ink-subtle">Evidence: </span>
                          {skill.projects.map((slug, i) => (
                            <span key={slug}>
                              {i > 0 ? ", " : ""}
                              <Link
                                href={`/projects/${slug}`}
                                className="text-accent underline underline-offset-2"
                              >
                                {slug}
                              </Link>
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      <LevelLegend />
    </div>
  );
}

/**
 * AC-06.2: the definitions are displayed on the page. Publishing the scale is
 * itself the anti-generic move — it is the opposite of an unexplained "92%".
 */
function LevelLegend() {
  return (
    <div className="border-rule mt-[var(--space-8)] border-t pt-[var(--space-5)]">
      <h3 className="font-text text-ink-subtle text-xs font-medium tracking-[var(--tracking-caps)] uppercase">
        What the levels mean
      </h3>
      <dl className="mt-[var(--space-4)] grid gap-[var(--space-3)] sm:grid-cols-2">
        {SKILL_LEVELS.map((level) => (
          <div key={level} className="flex gap-[var(--space-3)]">
            <dt className={`w-20 shrink-0 text-xs ${LEVEL_STYLE[level]}`}>{level}</dt>
            <dd className="text-ink-muted text-xs">{SKILL_LEVEL_DEFINITIONS[level]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
