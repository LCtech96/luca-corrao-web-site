export const LOCALES = ["it", "en", "de", "fr"] as const

export type Locale = (typeof LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  de: "Deutsch",
  fr: "Français",
}

export const DEFAULT_LOCALE: Locale = "it"

export const LOCALE_STORAGE_KEY = "luca-corrao-locale"
