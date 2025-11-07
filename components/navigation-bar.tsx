"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, Building2, Grid3X3, LogIn, LogOut, User } from "lucide-react"
import { RegistrationModal } from "@/components/registration-modal"
import { WorkWithUsModal } from "@/components/work-with-us-modal"
import { ShowcaseModal } from "@/components/showcase-modal"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/hooks/use-auth"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { signOut } from "@/lib/supabase/auth-service"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function NavigationBar() {
  const { user, loading } = useAuth()
  const { isAdmin } = useIsAdmin()
  const { toast } = useToast()
  const [activeModal, setActiveModal] = useState<"registration" | "work" | "showcase" | "login" | null>(null)

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logout effettuato",
        description: "Sei stato disconnesso con successo.",
      })
    } catch (error) {
      console.error('Errore logout:', error)
      toast({
        title: "Errore",
        description: "Impossibile disconnettersi. Riprova.",
        variant: "destructive",
      })
    }
  }

  // Previene il rendering di più modal contemporaneamente
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [activeModal])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-500/30 shadow-lg shadow-red-500/20">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Logo/Brand - Red Bull Style */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-cyan-400 rounded-full shadow-lg shadow-red-500/50"></div>
              <span className="text-lg font-bold text-white tracking-wider">LUCA CORRAO</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              {!user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModal("login")}
                    className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-200 font-semibold"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Log in</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModal("registration")}
                    className="flex items-center gap-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-semibold"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Registrati</span>
                  </Button>
                </>
              ) : (
                <>
                  {/* Admin Dashboard Button (solo per Luca) */}
                  {isAdmin && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 transition-colors duration-200 font-semibold"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline">Admin</span>
                      </Button>
                    </Link>
                  )}
                  
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-200 font-semibold"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Profilo</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal("work")}
                className="flex items-center gap-2 text-gray-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors duration-200 font-semibold"
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Lavora con noi</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal("showcase")}
                className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors duration-200 font-semibold"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Vetrina</span>
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Modals - Renderizzati condizionalmente */}
      {activeModal === "login" && (
        <LoginModal onClose={closeModal} />
      )}

      {activeModal === "registration" && (
        <RegistrationModal onClose={closeModal} />
      )}
      
      {activeModal === "work" && (
        <WorkWithUsModal onClose={closeModal} />
      )}
      
      {activeModal === "showcase" && (
        <ShowcaseModal onClose={closeModal} />
      )}
    </>
  )
}