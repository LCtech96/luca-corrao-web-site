"use client"

import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LOCALES, LOCALE_LABELS, useLanguage, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type LanguageSelectorProps = {
  className?: string
  /** Compact trigger for the navigation bar */
  compact?: boolean
  /** Icon + locale code only — best for crowded mobile headers */
  iconOnly?: boolean
}

const LOCALE_SHORT: Record<Locale, string> = {
  it: "IT",
  en: "EN",
  de: "DE",
  fr: "FR",
}

export function LanguageSelector({
  className,
  compact = false,
  iconOnly = false,
}: LanguageSelectorProps) {
  const { locale, setLocale, t } = useLanguage()

  if (iconOnly) {
    return (
      <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
        <SelectTrigger
          aria-label={t.common.selectLanguage}
          className={cn(
            "h-9 w-auto gap-1.5 border-gray-200 dark:border-gray-700 bg-transparent px-2",
            "text-gray-800 dark:text-gray-100 hover:bg-cyan-500/10 focus:ring-cyan-500/40",
            "[&>svg:last-child]:hidden",
            className,
          )}
        >
          <Globe className="h-4 w-4 shrink-0 text-cyan-500" aria-hidden />
          <span className="text-xs font-bold tracking-wide">{LOCALE_SHORT[locale]}</span>
        </SelectTrigger>
        <SelectContent align="end">
          {LOCALES.map((code) => (
            <SelectItem key={code} value={code}>
              <span className="font-semibold mr-2">{LOCALE_SHORT[code]}</span>
              {LOCALE_LABELS[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe
        className={cn(
          "shrink-0 text-gray-600 dark:text-gray-300",
          compact ? "w-4 h-4" : "w-5 h-5",
        )}
        aria-hidden
      />
      <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
        <SelectTrigger
          aria-label={t.common.selectLanguage}
          className={cn(
            "border-gray-200 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-100",
            "hover:bg-cyan-500/10 focus:ring-cyan-500/40",
            compact ? "h-8 w-[132px] text-sm" : "h-10 w-full min-w-[180px]",
          )}
        >
          <SelectValue placeholder={t.common.selectLanguage} />
        </SelectTrigger>
        <SelectContent>
          {LOCALES.map((code) => (
            <SelectItem key={code} value={code}>
              {LOCALE_LABELS[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
