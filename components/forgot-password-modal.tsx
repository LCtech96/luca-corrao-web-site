"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import { sendPasswordResetEmail } from "@/lib/supabase/auth-service"
import { useToast } from "@/hooks/use-toast"

interface ForgotPasswordModalProps {
  onClose: () => void
}

export function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Email richiesta",
        description: "Inserisci la tua email per continuare.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await sendPasswordResetEmail(email)
      
      setEmailSent(true)
      toast({
        title: "Email inviata! ✅",
        description: "Controlla la tua casella email per il link di reset.",
      })
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      // Messaggi di errore più specifici
      let errorMessage = "Impossibile inviare l'email. Riprova."
      
      if (error.message) {
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          errorMessage = "Troppi tentativi. Attendi qualche minuto prima di riprovare."
        } else if (error.message.includes('not found') || error.message.includes('user')) {
          errorMessage = "Email non trovata. Verifica di aver inserito l'email corretta."
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Errore di connessione. Verifica la tua connessione internet."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Password Dimenticata?</DialogTitle>
          <DialogDescription>
            {!emailSent 
              ? "Inserisci la tua email e ti invieremo un link per reimpostare la password."
              : "Abbiamo inviato un link di reset alla tua email."}
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tua@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-700"
                disabled={isLoading}
              >
                {isLoading ? "Invio..." : "Invia Link"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Email Inviata!</h3>
              <p className="text-sm text-gray-600">
                Controlla la tua casella email <strong>{email}</strong> e clicca sul link per reimpostare la password.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <p className="text-gray-700">
                <strong>Non hai ricevuto l'email?</strong>
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Controlla la cartella spam</li>
                <li>Verifica che l'email sia corretta</li>
                <li>Attendi qualche minuto</li>
              </ul>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Chiudi
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

