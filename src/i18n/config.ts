export const locales = ["en-US", "fr-FR", "ja-JP"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en-US";
