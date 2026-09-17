/**
 * Per-project Open Graph image — AC-13.3.
 *
 * Generated at build time by next/og (Satori), 1200x630, carrying the project
 * title, the one-liner, and the primary technologies. That is exactly the
 * information a link preview in Slack or LinkedIn should convey: the preview is
 * doing the same job as the summary block, in less space.
 *
 * Satori renders a subset of CSS and cannot read our custom properties, so the
 * token values are repeated here as literals. This is the one place in the
 * codebase where that is permitted, and it is why they are named.
 */
import { ImageResponse } from "next/og";

import { getAllProjectSlugs, getProject } from "@/lib/content";

export const alt = "Case study preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

/* Literal copies of --ground, --ink, --ink-muted, --ink-subtle and --accent
   from styles/tokens.css, converted out of oklch() which Satori cannot parse. */
const GROUND = "#faf9f6";
const INK = "#1f1a16";
const INK_MUTED = "#6b6259";
const INK_SUBTLE = "#948c83";
const ACCENT = "#a8442a";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: GROUND,
          color: INK,
          fontSize: 48,
        }}
      >
        Case study
      </div>,
      size,
    );
  }

  const headline = project.metrics.find((m) => m.isHeadline);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: GROUND,
        color: INK,
        padding: 72,
        // A single hairline of accent along the top edge, mirroring the
        // restraint of the site itself. No gradient, no glass (§11.2).
        borderTop: `10px solid ${ACCENT}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: INK_SUBTLE,
          }}
        >
          Case study
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: -2,
            fontWeight: 600,
          }}
        >
          {project.title}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            lineHeight: 1.35,
            color: INK_MUTED,
            maxWidth: 900,
          }}
        >
          {project.tagline}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {headline ? (
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 34 }}>
            <span style={{ color: INK_SUBTLE }}>{headline.baseline}</span>
            <span style={{ margin: "0 18px", color: INK_SUBTLE }}>→</span>
            <span style={{ color: ACCENT, fontWeight: 600 }}>{headline.result}</span>
            <span style={{ marginLeft: 20, fontSize: 24, color: INK_MUTED }}>
              {headline.label}
            </span>
          </div>
        ) : null}

        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            color: INK_SUBTLE,
          }}
        >
          {project.stack.slice(0, 6).join("  ·  ")}
        </div>
      </div>
    </div>,
    size,
  );
}
