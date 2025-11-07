"use client"

import { useAuth } from "@/hooks/use-auth"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { Button } from "@/components/ui/button"
import { ChevronLeft, User, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { TwoFactorSetup } from "@/components/two-factor-setup"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { isAdmin } = useIsAdmin()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accesso richiesto</h1>
          <p className="text-gray-600 mb-6">Devi essere autenticato per vedere questa pagina.</p>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">Torna alla Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-amber-600">
            <ChevronLeft className="w-5 h-5" />
            <span>Torna alla Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Il Mio Profilo</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Informazioni Account</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium">{user.user_metadata?.full_name || 'Non impostato'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
                {user.email_confirmed_at ? (
                  <p className="text-xs text-green-600">✓ Verificata</p>
                ) : (
                  <p className="text-xs text-yellow-600">⚠ Non verificata</p>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ruolo</p>
                  <p className="font-medium text-purple-600">Amministratore</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2FA Setup */}
        <TwoFactorSetup />

        {/* My Bookings */}
        <div className="bg-white rounded-lg border p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Le Mie Prenotazioni</h2>
          <p className="text-gray-600">Le tue prenotazioni appariranno qui.</p>
          {/* TODO: Implementare lista prenotazioni */}
        </div>
      </div>
    </div>
  )
}

