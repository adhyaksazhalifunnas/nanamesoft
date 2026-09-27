/**
 * The error boundary's strings, and nothing else.
 *
 * `error.tsx` has to be a Client Component (Next requires it), and it has to
 * pick its language at runtime from the route. Importing `getDictionary` there
 * pulled all three complete dictionaries into the browser bundle on EVERY
 * page — 10 KB gzipped of Japanese and Indonesian prose that the error page
 * alone might one day need.
 *
 * This is the same data, cut down to the branch the boundary actually reads.
 */
import type { Locale } from "./config";

export const ERROR_STRINGS: Record<
  Locale,
  { code: string; title: string; body: string; tryAgain: string }
> = {
  en: {
    code: "Error",
    title: "Something broke on this page",
    body: "This is my bug, not yours. Reloading usually fixes it.",
    tryAgain: "Try again",
  },
  id: {
    code: "Kesalahan",
    title: "Ada yang rusak di halaman ini",
    body: "Ini kesalahan saya, bukan Anda. Biasanya memuat ulang sudah cukup.",
    tryAgain: "Coba lagi",
  },
  ja: {
    code: "エラー",
    title: "このページで問題が発生しました",
    body: "こちらの不具合です。多くの場合、再読み込みで解決します。",
    tryAgain: "再試行",
  },
};
