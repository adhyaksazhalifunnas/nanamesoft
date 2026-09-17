/**
 * frontmatter.ts — the one place MDX frontmatter is parsed.
 *
 * Shared by src/lib/content.ts (render path) and scripts/validate-content.ts
 * (build gate) so the two can never disagree about what a file contains. A
 * validator that parses differently from the loader is worse than no validator.
 *
 * Why the custom YAML engine: YAML 1.1 has a `timestamp` type, so an unquoted
 * `startDate: 2023-02-27` is parsed into a JavaScript Date before Zod ever sees
 * it — and `z.iso.date()` then fails with "expected string, received Date".
 * Quoting every date in every file would work, but it is exactly the kind of
 * invisible rule that makes adding a project take longer than 90 minutes.
 * JSON_SCHEMA omits the timestamp type, so dates stay strings and the schema
 * is the only thing deciding whether a date is valid.
 */
import matter from "gray-matter";
// js-yaml ships as ESM with named exports only; there is no default export.
import { JSON_SCHEMA, load as loadYaml } from "js-yaml";

export type ParsedFile = {
  data: Record<string, unknown>;
  content: string;
};

export function parseFrontmatter(raw: string): ParsedFile {
  const { data, content } = matter(raw, {
    engines: {
      yaml: (str: string) => loadYaml(str, { schema: JSON_SCHEMA }) as object,
    },
  });

  return { data: data as Record<string, unknown>, content };
}
