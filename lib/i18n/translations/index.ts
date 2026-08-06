import type { Locale } from "../types"
import type { TranslationKeys } from "./it"
import { it } from "./it"
import { en } from "./en"
import { de } from "./de"
import { fr } from "./fr"

export const translations: Record<Locale, TranslationKeys> = {
  it,
  en,
  de,
  fr,
}

export type { TranslationKeys }
