import Section from "./Section";
import { experience } from "@/content/site";

export default function Experience() {
  if (experience.length === 0) return null;

  return (
    <Section id="experience" eyebrow="Where I have worked" title="Experience">
      <ol className="space-y-8">
        {experience.map((job) => (
          <li
            key={`${job.company}-${job.period}`}
            className="grid gap-2 border-l border-border pl-6 sm:grid-cols-4 sm:gap-6"
          >
            <p className="text-sm text-muted sm:col-span-1">{job.period}</p>
            <div className="sm:col-span-3">
              <h3 className="font-semibold tracking-tight">
                {job.role}
                <span className="font-normal text-muted"> · {job.company}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {job.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
