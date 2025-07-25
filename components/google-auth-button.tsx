"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, CheckCircle, AlertCircle } from "lucide-react"

interface GoogleAuthButtonProps {
  onAuthSuccess?: (tokens: any) => void
  onAuthError?: (error: string) => void
}

export function GoogleAuthButton({ onAuthSuccess, onAuthError }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Ottieni l'URL di autorizzazione
      const response = await fetch('/api/auth/google')
      const data = await response.json()

      if (data.authUrl) {
        // Apri la finestra di autorizzazione Google
        const authWindow = window.open(
          data.authUrl,
          'google-auth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        )

        // Polling per verificare quando l'autenticazione è completata
        const checkAuth = setInterval(async () => {
          try {
            // Verifica se la finestra è stata chiusa
            if (authWindow?.closed) {
              clearInterval(checkAuth)
              setIsLoading(false)
              return
            }

            // Prova a ottenere i token dal callback
            const callbackResponse = await fetch('/api/auth/google/callback')
            if (callbackResponse.ok) {
              const callbackData = await callbackResponse.json()
              
              if (callbackData.success) {
                clearInterval(checkAuth)
                authWindow?.close()
                setIsAuthenticated(true)
                setIsLoading(false)
                
                // Salva i token nel localStorage (in produzione usare un metodo più sicuro)
                localStorage.setItem('googleTokens', JSON.stringify(callbackData.tokens))
                
                onAuthSuccess?.(callbackData.tokens)
              }
            }
          } catch (error) {
            // Continua il polling
          }
        }, 1000)

        // Timeout dopo 5 minuti
        setTimeout(() => {
          clearInterval(checkAuth)
          authWindow?.close()
          setIsLoading(false)
          setError('Timeout dell\'autenticazione. Riprova.')
          onAuthError?.('Timeout dell\'autenticazione')
        }, 300000) // 5 minuti

      } else {
        throw new Error('Errore nella generazione URL di autorizzazione')
      }
    } catch (error) {
      console.error('Errore nell\'autenticazione Google:', error)
      setError('Errore nell\'autenticazione Google. Riprova.')
      onAuthError?.('Errore nell\'autenticazione Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('googleTokens')
    setIsAuthenticated(false)
    onAuthSuccess?.(null)
  }

  // Verifica se l'utente è già autenticato
  const checkExistingAuth = () => {
    const tokens = localStorage.getItem('googleTokens')
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens)
        if (parsedTokens.access_token) {
          setIsAuthenticated(true)
          return parsedTokens
        }
      } catch (error) {
        localStorage.removeItem('googleTokens')
      }
    }
    return null
  }

  // Controlla l'autenticazione esistente al caricamento
  useState(() => {
    const existingTokens = checkExistingAuth()
    if (existingTokens) {
      onAuthSuccess?.(existingTokens)
    }
  })

  if (isAuthenticated) {
    return (
      <div className="space-y-2">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Autenticato con Google. Ora puoi accedere alla spreadsheet.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full"
        >
          Disconnetti da Google
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={handleGoogleAuth} 
        disabled={isLoading}
        className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        {isLoading ? "Autenticazione in corso..." : "Accedi con Google"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        L'autenticazione è necessaria per accedere alla spreadsheet
      </p>
    </div>
  )
} 