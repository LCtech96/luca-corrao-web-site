"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/supabase/auth-service"
import { useToast } from "@/hooks/use-toast"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Password non corrispondono",
        description: "Assicurati che le due password siano identiche.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 8) {
      toast({
        title: "Password troppo corta",
        description: "La password deve essere di almeno 8 caratteri.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await updatePassword(password)
      
      setIsSuccess(true)
      toast({
        title: "Password aggiornata! ✅",
        description: "La tua password è stata cambiata con successo.",
      })

      // Redirect dopo 2 secondi
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error: any) {
      console.error('Password update error:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile aggiornare la password. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Password Aggiornata!</h1>
          <p className="text-gray-600 mb-6">
            La tua password è stata cambiata con successo. Verrai reindirizzato alla home...
          </p>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Vai alla Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Nuova Password</h1>
          <p className="text-gray-600">Inserisci la tua nuova password sicura</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password">Nuova Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimo 8 caratteri"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={8}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Ripeti la password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Strength Indicator */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">Requisiti password:</p>
            <div className="space-y-1">
              <div className={`text-xs flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-gray-300'}`} />
                Almeno 8 caratteri
              </div>
              <div className={`text-xs flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-600' : 'bg-gray-300'}`} />
                Una lettera maiuscola
              </div>
              <div className={`text-xs flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-600' : 'bg-gray-300'}`} />
                Un numero
              </div>
              <div className={`text-xs flex items-center gap-2 ${password === confirmPassword && password.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${password === confirmPassword && password.length > 0 ? 'bg-green-600' : 'bg-gray-300'}`} />
                Le password corrispondono
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Aggiornamento..." : "Aggiorna Password"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-amber-600">
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  )
}

