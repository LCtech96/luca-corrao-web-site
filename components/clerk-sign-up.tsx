"use client"

import { SignUp } from "@clerk/nextjs"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ClerkSignUpProps {
  onClose?: () => void
}

export function ClerkSignUp({ onClose }: ClerkSignUpProps) {
  const [motherMaidenName, setMotherMaidenName] = useState("")
  const [showCustomFields, setShowCustomFields] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSignUpComplete = async (userId: string) => {
    if (!motherMaidenName.trim()) {
      setMessage({ type: 'error', text: 'Il cognome della madre è obbligatorio' })
      return
    }

    setIsSubmitting(true)
    try {
      // Qui puoi salvare il cognome della madre nel database
      // Per ora lo salviamo in localStorage come esempio
      localStorage.setItem(`motherMaidenName_${userId}`, motherMaidenName)
      
      setMessage({ type: 'success', text: 'Registrazione completata con successo!' })
      
      // Chiudi il modal dopo 2 secondi
      setTimeout(() => {
        onClose?.()
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Errore durante il salvataggio dei dati' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Registrazione
          </CardTitle>
          <CardDescription className="text-center">
            Crea il tuo account per accedere ai servizi
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-500' : 'border-green-500'}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
                formFieldInput: "border-gray-300 focus:border-amber-500 focus:ring-amber-500",
                footerActionLink: "text-amber-600 hover:text-amber-700",
              }
            }}
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
          />

          {/* Campi personalizzati */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="motherMaidenName">
                Cognome della madre *
              </Label>
              <Input
                id="motherMaidenName"
                type="text"
                value={motherMaidenName}
                onChange={(e) => setMotherMaidenName(e.target.value)}
                placeholder="Inserisci il cognome della madre"
                className="mt-1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Questo campo è obbligatorio per la sicurezza del tuo account
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Annulla
            </Button>
            <Button
              onClick={() => handleSignUpComplete("temp-user-id")}
              disabled={!motherMaidenName.trim() || isSubmitting}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              {isSubmitting ? "Completando..." : "Completa Registrazione"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 