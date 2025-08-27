"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, Building2, Grid3X3, LogIn, LogOut } from "lucide-react"
import { RegistrationModal } from "@/components/registration-modal"
import { WorkWithUsModal } from "@/components/work-with-us-modal"
import { ShowcaseModal } from "@/components/showcase-modal"
import { LoginModal } from "@/components/login-modal"
// import { useAuth } from "@/lib/auth-context"

export function NavigationBar() {
  // const { isAuthenticated, logout } = useAuth()
  const isAuthenticated = false
  const logout = () => {}
  const [activeModal, setActiveModal] = useState<"registration" | "work" | "showcase" | "login" | null>(null)

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleLogout = () => {
    logout()
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <span className="text-xl font-semibold text-gray-900">Luca Corrao</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModal("login")}
                    className="flex items-center gap-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Log in</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModal("registration")}
                    className="flex items-center gap-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Registrati</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal("work")}
                className="flex items-center gap-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-200"
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Lavora con noi</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveModal("showcase")}
                className="flex items-center gap-2 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-200"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline">Vetrina</span>
              </Button>
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