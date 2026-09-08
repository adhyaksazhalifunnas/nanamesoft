import Section from "./Section";
import { site } from "@/content/site";

export default function About() {
  return (
    <Section id="about" eyebrow="Background" title="About me">
      <div className="grid gap-12 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          {site.about.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-6 md:col-span-2">
          {site.skills.map((group) => (
            <div key={group.group}>
              <h3 className="text-sm font-semibold tracking-wide uppercase">
                {group.group}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
