"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useState } from "react"
import { 
  signInWithGoogle, 
  signInWithFacebook, 
  signInWithMetaMask,
  signInWithPhantom,
  signInWithWalletConnect,
  signInWithCoinbase,
  signInWithTrust,
  signUpWithEmail 
} from "@/lib/supabase/auth-service"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface RegistrationModalProps {
  onClose: () => void
}

export function RegistrationModal({ onClose }: RegistrationModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      // Google OAuth redirects automatically
    } catch (error) {
      console.error('Errore sign in con Google:', error)
      toast({
        title: "Errore",
        description: "Impossibile accedere con Google. Riprova.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleFacebookSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithFacebook()
      // Facebook OAuth redirects automatically
    } catch (error) {
      console.error('Errore sign in con Facebook:', error)
      toast({
        title: "Errore",
        description: "Impossibile accedere con Facebook. Riprova.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }


  const handleWalletSignIn = async (walletType: 'metamask' | 'phantom' | 'walletconnect' | 'coinbase' | 'trust') => {
    setIsLoading(true)
    try {
      switch (walletType) {
        case 'metamask':
          await signInWithMetaMask()
          break
        case 'phantom':
          await signInWithPhantom()
          break
        case 'walletconnect':
          await signInWithWalletConnect()
          break
        case 'coinbase':
          await signInWithCoinbase()
          break
        case 'trust':
          await signInWithTrust()
          break
      }
      
      toast({
        title: "Successo!",
        description: "Accesso effettuato con successo.",
      })
      onClose()
    } catch (error: any) {
      console.error('Errore sign in con wallet:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile accedere. Verifica che il wallet sia installato.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = await signUpWithEmail(email, password, `${email.split('@')[0]}`)
      
      // Controlla se richiede verifica email
      if ((data as any).needsEmailVerification) {
        toast({
          title: "Verifica la tua email! 📧",
          description: "Abbiamo inviato un link di conferma. Clicca sul link per attivare l'account.",
          duration: 6000,
        })
      } else {
        toast({
          title: "Registrazione completata!",
          description: "Il tuo account è stato creato con successo.",
        })
      }
      
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error('Errore registrazione:', error)
      toast({
        title: "Errore nella registrazione",
        description: error.message || 'Riprova più tardi.',
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
            <DialogTitle>Registrati</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Registrati</h2>
            <p className="text-gray-600">Crea il tuo account</p>
          </div>

          {/* Social Sign In Buttons */}
          <div className="space-y-3">
            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? 'Connessione...' : 'Continua con Google'}
            </Button>

            {/* Facebook Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white hover:bg-[#1877F2]/90 border-[#1877F2]"
              onClick={handleFacebookSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {isLoading ? 'Connessione...' : 'Continua con Facebook'}
            </Button>


            {/* Web3 Wallet Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 border-purple-600"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                  </svg>
                  {isLoading ? 'Connessione...' : 'Continua con Wallet'}
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuItem 
                  onClick={() => handleWalletSignIn('metamask')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg viewBox="0 0 40 40" fill="none">
                        <path d="M32.958 4.583l-11.042 8.208 2.042-4.792z" fill="#E17726"/>
                        <path d="M7.042 4.583l10.958 8.292-1.958-4.875z" fill="#E27625"/>
                        <path d="M28.25 27.542l-2.917 4.458 6.25 1.708 1.792-6.083z" fill="#E27625"/>
                        <path d="M6.667 27.625l1.791 6.083 6.25-1.708-2.916-4.458z" fill="#E27625"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">MetaMask</div>
                      <div className="text-xs text-muted-foreground">Ethereum</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => handleWalletSignIn('phantom')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 flex-shrink-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg"></div>
                    <div>
                      <div className="font-medium">Phantom</div>
                      <div className="text-xs text-muted-foreground">Solana & Ethereum</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => handleWalletSignIn('walletconnect')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 flex-shrink-0 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      WC
                    </div>
                    <div>
                      <div className="font-medium">WalletConnect</div>
                      <div className="text-xs text-muted-foreground">Multi-chain</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => handleWalletSignIn('coinbase')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 flex-shrink-0 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg viewBox="0 0 28 28" fill="white" className="w-4 h-4">
                        <path d="M14 28c7.732 0 14-6.268 14-14S21.732 0 14 0 0 6.268 0 14s6.268 14 14 14z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Coinbase Wallet</div>
                      <div className="text-xs text-muted-foreground">Ethereum & more</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => handleWalletSignIn('trust')}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-6 h-6 flex-shrink-0 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      TW
                    </div>
                    <div>
                      <div className="font-medium">Trust Wallet</div>
                      <div className="text-xs text-muted-foreground">Multi-chain</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Oppure</span>
            </div>
          </div>

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
                  minLength={8}
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