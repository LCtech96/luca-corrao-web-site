"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState } from "react"

interface RegistrationModalProps {
  onClose: () => void
}

export function RegistrationModal({ onClose }: RegistrationModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [motherMaidenName, setMotherMaidenName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"register" | "verify">("register")
  const [verificationCode, setVerificationCode] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          motherMaidenName
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setStep("verify")
        alert(`Codice di verifica inviato a ${email}. Controlla la console per il codice di debug.`)
      } else {
        alert(data.error || 'Errore nella registrazione')
      }
    } catch (error) {
      console.error('Errore registrazione:', error)
      alert('Errore nella registrazione. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify',
          email,
          code: verificationCode
        })
      })

      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('userEmail', email)
        alert('Registrazione completata con successo!')
        onClose()
      } else {
        alert(data.error || 'Errore nella verifica')
      }
    } catch (error) {
      console.error('Errore verifica:', error)
      alert('Errore nella verifica. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>
              {step === "register" ? "Registrati" : "Verifica Email"}
            </DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {step === "register" ? "Registrati" : "Verifica Email"}
            </h2>
            <p className="text-gray-600">
              {step === "register" 
                ? "Crea il tuo account" 
                : "Inserisci il codice di verifica"
              }
            </p>
          </div>
          
          {step === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="la-tua-email@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="La tua password (min 8 caratteri)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motherName">Cognome da nubile della madre</Label>
                <Input
                  id="motherName"
                  type="text"
                  value={motherMaidenName}
                  onChange={(e) => setMotherMaidenName(e.target.value)}
                  placeholder="Cognome da nubile della madre"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Registrazione in corso...' : 'Registrati'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Codice di Verifica</Label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Inserisci il codice di 5 cifre"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Verifica in corso...' : 'Verifica Codice'}
              </Button>
              
              <Button 
                type="button" 
                className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setStep("register")}
              >
                Torna alla registrazione
              </Button>
            </form>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hai già un account?{' '}
              <button 
                className="text-blue-600 hover:underline"
                onClick={() => {
                  onClose()
                  // Qui potresti aprire il modal di login
                }}
              >
                Accedi
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 