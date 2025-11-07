"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState } from "react"
import { ForgotPasswordModal } from "./forgot-password-modal"
import { signInWithEmail } from "@/lib/supabase/auth-service"
import { useToast } from "@/hooks/use-toast"

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await signInWithEmail(email, password)
      
      toast({
        title: "Accesso effettuato! ✅",
        description: "Benvenuto!",
      })
      
      onClose()
    } catch (error: any) {
      console.error('Errore login:', error)
      toast({
        title: "Errore di accesso",
        description: error.message || "Email o password non corretti. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Accedi</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Accedi</h2>
            <p className="text-gray-600">Inserisci le tue credenziali</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="La tua password"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>
          
          <div className="text-center space-y-3">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-amber-600 hover:underline block w-full"
            >
              Password dimenticata?
            </button>
            
            <p className="text-sm text-gray-600">
              Non hai un account?{' '}
              <button 
                className="text-blue-600 hover:underline"
                onClick={() => {
                  onClose()
                  // Qui potresti aprire il modal di registrazione
                }}
              >
                Registrati
              </button>
            </p>
          </div>
        </div>
      </DialogContent>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </Dialog>
  )
} 