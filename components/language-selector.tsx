"use client"

import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LOCALES, LOCALE_LABELS, useLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type LanguageSelectorProps = {
  className?: string
  /** Compact trigger for the navigation bar */
  compact?: boolean
}

export function LanguageSelector({ className, compact = false }: LanguageSelectorProps) {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe
        className={cn(
          "shrink-0 text-gray-600 dark:text-gray-300",
          compact ? "w-4 h-4" : "w-5 h-5",
        )}
        aria-hidden
      />
      <Select value={locale} onValueChange={(value) => setLocale(value as typeof locale)}>
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
