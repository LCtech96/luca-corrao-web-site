"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/supabase/auth-service"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Verifica il token quando la pagina si carica
  useEffect(() => {
    const verifyToken = async () => {
      const supabase = createClient()
      
      // Controlla se c'è un hash fragment con il token (Supabase usa hash per reset password)
      if (typeof window !== 'undefined') {
        const hash = window.location.hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const type = params.get('type')
        
        // Se c'è un token nell'hash, verifichiamo la sessione
        if (accessToken && type === 'recovery') {
          try {
            // Supabase gestisce automaticamente il token dall'hash
            const { data: { session }, error } = await supabase.auth.getSession()
            
            if (error || !session) {
              setIsValidToken(false)
              setErrorMessage("Link di reset non valido o scaduto. Richiedi un nuovo link di reset password.")
            } else {
              setIsValidToken(true)
            }
          } catch (err) {
            console.error('Error verifying token:', err)
            setIsValidToken(false)
            setErrorMessage("Errore nella verifica del link. Riprova più tardi.")
          }
        } else {
          // Controlla se c'è un code nei query params (alternativa)
          const code = searchParams.get('code')
          if (code) {
            try {
              const { data: { session }, error } = await supabase.auth.getSession()
              if (error || !session) {
                setIsValidToken(false)
                setErrorMessage("Link di reset non valido o scaduto. Richiedi un nuovo link di reset password.")
              } else {
                setIsValidToken(true)
              }
            } catch (err) {
              console.error('Error verifying code:', err)
              setIsValidToken(false)
              setErrorMessage("Errore nella verifica del link. Riprova più tardi.")
            }
          } else {
            // Nessun token trovato
            setIsValidToken(false)
            setErrorMessage("Link di reset non valido. Assicurati di aver cliccato sul link completo dall'email.")
          }
        }
      }
    }

    verifyToken()
  }, [searchParams])

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
      // Verifica che ci sia ancora una sessione valida
      const supabase = createClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error("La sessione di reset è scaduta. Richiedi un nuovo link di reset password.")
      }

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
      const errorMsg = error.message || "Impossibile aggiornare la password. Riprova."
      toast({
        title: "Errore",
        description: errorMsg,
        variant: "destructive",
      })
      
      // Se la sessione è scaduta, mostra un messaggio più chiaro
      if (errorMsg.includes("scaduta") || errorMsg.includes("expired")) {
        setErrorMessage(errorMsg)
        setIsValidToken(false)
      }
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

  // Mostra loading mentre verifica il token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Verifica del link...</h1>
          <p className="text-gray-600">Stiamo verificando il tuo link di reset password</p>
        </div>
      </div>
    )
  }

  // Mostra errore se il token non è valido
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Link Non Valido</h1>
            <p className="text-gray-600 mb-4">{errorMessage || "Il link di reset password non è valido o è scaduto."}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Cosa puoi fare:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Richiedi un nuovo link di reset password</li>
              <li>Assicurati di aver cliccato sul link completo dall'email</li>
              <li>Controlla che il link non sia scaduto (valido per 24 ore)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Torna alla Home
            </Button>
            <Button
              onClick={() => router.push('/?showLogin=true')}
              variant="outline"
              className="w-full"
            >
              Richiedi Nuovo Link
            </Button>
          </div>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Caricamento...</h1>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

