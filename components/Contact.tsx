import Section from "./Section";
import { site } from "@/content/site";

export default function Contact() {
  return (
    <Section id="contact" eyebrow="Say hello" title="Get in touch">
      <p className="max-w-2xl leading-relaxed text-muted">
        The fastest way to reach me is email — I read everything and reply to
        anything that is not a cold pitch.
      </p>

      <a
        href={`mailto:${site.email}`}
        className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition hover:opacity-90"
      >
        {site.email}
      </a>

      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {site.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              {social.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
