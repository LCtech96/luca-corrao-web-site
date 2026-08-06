"use client"

import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type SiteFooterProps = {
  className?: string
  variant?: "default" | "hospitality" | "ai"
}

export function SiteFooter({ className, variant = "default" }: SiteFooterProps) {
  const t = useTranslation()

  const tagline =
    variant === "hospitality"
      ? t.footer.hospitalityTagline
      : variant === "ai"
        ? t.footer.aiTagline
        : t.footer.hospitalityTagline

  const mutedClass =
    variant === "hospitality"
      ? "text-amber-300"
      : variant === "ai"
        ? "text-blue-300"
        : "text-gray-300"

  return (
    <footer
      className={cn(
        "w-full border-t border-gray-200/60 dark:border-white/10",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Language selector: mobile only (desktop uses navbar) */}
        <div className="md:hidden mb-5 flex flex-col items-center gap-2">
          <p className={cn("text-sm font-medium", mutedClass)}>{t.common.language}</p>
          <LanguageSelector className="w-full max-w-xs justify-center" />
        </div>

        <div className="text-center space-y-1">
          <p className={cn("text-sm", mutedClass)}>
            © {new Date().getFullYear()} Luca Corrao. {t.footer.rights} | {tagline}
          </p>
          {(variant === "hospitality" || variant === "default") && (
            <p className={cn("text-xs", mutedClass)}>{t.footer.location}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
