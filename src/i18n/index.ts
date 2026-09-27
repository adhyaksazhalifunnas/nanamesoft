/**
 * Dictionary access.
 *
 * All three dictionaries are plain modules rather than dynamic imports: the
 * whole set is a few kilobytes, every page is statically generated, and a
 * synchronous lookup keeps every consumer a Server Component. An async
 * `getDictionary` would force `await` into components that have no other
 * reason to be async.
 */
import { DEFAULT_LOCALE, type Locale } from "./config";
import en, { type Dictionary } from "./dictionaries/en";
import id from "./dictionaries/id";
import ja from "./dictionaries/ja";

const DICTIONARIES: Record<Locale, Dictionary> = { en, id, ja };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export type { Dictionary };
export * from "./config";
