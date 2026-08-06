"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  UserPlus,
  Building2,
  Grid3X3,
  LogIn,
  LogOut,
  User,
  Shield,
  Menu,
} from "lucide-react"
import { RegistrationModal } from "@/components/registration-modal"
import { WorkWithUsModal } from "@/components/work-with-us-modal"
import { ShowcaseModal } from "@/components/showcase-modal"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/hooks/use-auth"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { signOut } from "@/lib/supabase/auth-service"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/lib/i18n"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function NavigationBar() {
  const { user } = useAuth()
  const { isAdmin } = useIsAdmin()
  const { toast } = useToast()
  const t = useTranslation()
  const [activeModal, setActiveModal] = useState<"registration" | "work" | "showcase" | "login" | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeModal = () => {
    setActiveModal(null)
  }

  const openModal = (modal: "registration" | "work" | "showcase" | "login") => {
    setMobileMenuOpen(false)
    setActiveModal(modal)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setMobileMenuOpen(false)
      toast({
        title: t.nav.logoutSuccessTitle,
        description: t.nav.logoutSuccessDesc,
      })
    } catch (error) {
      console.error("Errore logout:", error)
      toast({
        title: t.nav.logoutErrorTitle,
        description: t.nav.logoutErrorDesc,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [activeModal])

  const navButtonClass =
    "flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-200 font-semibold"

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-red-500/30 shadow-lg dark:shadow-red-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex justify-between items-center gap-2 min-w-0">
            {/* Logo — shrinks on narrow phones */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
              <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 bg-gradient-to-r from-red-500 to-cyan-400 rounded-full shadow-lg shadow-red-500/50" />
              <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white tracking-wider truncate">
                LUCA CORRAO
              </span>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-2 shrink-0">
              {!user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModal("login")}
                    className={navButtonClass}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.nav.login}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModal("registration")}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-semibold"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t.nav.register}</span>
                  </Button>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 transition-colors duration-200 font-semibold"
                      >
                        <Shield className="w-4 h-4" />
                        <span>{t.nav.admin}</span>
                      </Button>
                    </Link>
                  )}
                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className={navButtonClass}>
                      <User className="w-4 h-4" />
                      <span>{t.nav.profile}</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.nav.logout}</span>
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal("work")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors duration-200 font-semibold"
              >
                <Building2 className="w-4 h-4" />
                <span>{t.nav.workWithUs}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal("showcase")}
                className={navButtonClass}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>{t.nav.showcase}</span>
              </Button>

              <LanguageSelector compact />
              <ThemeToggle />
            </div>

            {/* Mobile actions: language always visible, rest in hamburger */}
            <div className="flex md:hidden items-center gap-1 shrink-0">
              <LanguageSelector iconOnly />
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 dark:text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10"
                    aria-label={t.nav.openMenu}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[min(100vw-2rem,20rem)] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left">{t.nav.menu}</SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 flex flex-col gap-1">
                    <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t.common.language}
                      </p>
                      <LanguageSelector className="w-full" />
                    </div>

                    {!user ? (
                      <>
                        <Button
                          variant="ghost"
                          className="justify-start gap-3 h-12"
                          onClick={() => openModal("login")}
                        >
                          <LogIn className="w-5 h-5" />
                          {t.nav.login}
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start gap-3 h-12"
                          onClick={() => openModal("registration")}
                        >
                          <UserPlus className="w-5 h-5" />
                          {t.nav.register}
                        </Button>
                      </>
                    ) : (
                      <>
                        {isAdmin && (
                          <Button variant="ghost" className="justify-start gap-3 h-12" asChild>
                            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                              <Shield className="w-5 h-5" />
                              {t.nav.admin}
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" className="justify-start gap-3 h-12" asChild>
                          <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                            <User className="w-5 h-5" />
                            {t.nav.profile}
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start gap-3 h-12 text-red-600 dark:text-red-400"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5" />
                          {t.nav.logout}
                        </Button>
                      </>
                    )}

                    <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

                    <Button
                      variant="ghost"
                      className="justify-start gap-3 h-12"
                      onClick={() => openModal("work")}
                    >
                      <Building2 className="w-5 h-5" />
                      {t.nav.workWithUs}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 h-12"
                      onClick={() => openModal("showcase")}
                    >
                      <Grid3X3 className="w-5 h-5" />
                      {t.nav.showcase}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {activeModal === "login" && <LoginModal onClose={closeModal} />}
      {activeModal === "registration" && <RegistrationModal onClose={closeModal} />}
      {activeModal === "work" && <WorkWithUsModal onClose={closeModal} />}
      {activeModal === "showcase" && <ShowcaseModal onClose={closeModal} />}
    </>
  )
}
