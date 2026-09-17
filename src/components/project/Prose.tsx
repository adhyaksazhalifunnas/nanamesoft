/**
 * Prose — renders the MDX body of a case study (PRD §5.2).
 *
 * Compiled at build time. Shiki runs here, on the server, so a highlighted code
 * block costs the visitor exactly zero JavaScript — which is the reason D-level
 * syntax highlighting was specified as build-time in the first place.
 *
 * Both Shiki themes are emitted as CSS custom properties and the site theme
 * picks which one is painted (see .prose pre in globals.css), so switching to
 * dark mode does not re-highlight anything.
 */
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export function Prose({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  themes: { light: "github-light", dark: "github-dark-dimmed" },
                  keepBackground: false,
                },
              ],
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "append",
                  properties: {
                    className: ["heading-anchor"],
                    ariaLabel: "Link to this section",
                  },
                  // A bare "#" would be read out as "number sign" by a screen
                  // reader; the aria-label above carries the real name and this
                  // is hidden from the accessibility tree.
                  content: {
                    type: "element",
                    tagName: "span",
                    properties: { ariaHidden: "true" },
                    children: [{ type: "text", value: "#" }],
                  },
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
