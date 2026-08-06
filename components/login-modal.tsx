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
import { useTranslation } from "@/lib/i18n"

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { toast } = useToast()
  const t = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await signInWithEmail(email, password)
      
      toast({
        title: t.login.successTitle,
        description: t.login.successDesc,
      })
      
      onClose()
    } catch (error: any) {
      console.error('Errore login:', error)
      toast({
        title: t.login.errorTitle,
        description: error.message || t.login.errorDesc,
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
            <DialogTitle>{t.login.title}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{t.login.title}</h2>
            <p className="text-gray-600">{t.login.subtitle}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.login.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.login.emailPlaceholder}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t.login.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.password}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t.login.submitting : t.login.submit}
            </Button>
          </form>
          
          <div className="text-center space-y-3">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-amber-600 hover:underline block w-full"
            >
              {t.login.forgotPassword}
            </button>
            
            <p className="text-sm text-gray-600">
              <button 
                className="text-blue-600 hover:underline"
                onClick={() => {
                  onClose()
                }}
              >
                {t.nav.register}
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