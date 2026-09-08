import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Built with Next.js and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
