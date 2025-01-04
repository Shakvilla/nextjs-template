import "server-only";
import type { Locale } from "./i18n-config";

// We enumerate all dictionaries here for better linting and typescript support.
// We also get the default import cleaner types.

const dictionaries = {
  "en-US": () => import("./dictionaries/en-us.json"),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries["en-US"]();
