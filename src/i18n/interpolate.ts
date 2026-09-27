/**
 * interpolate — fills {placeholders} in a dictionary string.
 *
 * Most dictionary entries that take a value are plain functions, which is the
 * nicer API. The contact form cannot use them: it is a Client Component, and
 * a function cannot cross the server/client boundary — Next fails the build
 * with "Functions cannot be passed directly to Client Components". So the few
 * strings that reach the client carry {name} placeholders instead, and this
 * fills them in on the other side.
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
