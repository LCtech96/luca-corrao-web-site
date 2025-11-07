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
import { sendWhatsAppOTP, verifyWhatsAppOTP } from "@/lib/whatsapp-auth-service"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Check } from "lucide-react"

interface RegistrationModalProps {
  onClose: () => void
}

export function RegistrationModal({ onClose }: RegistrationModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [whatsappPhone, setWhatsappPhone] = useState("")
  const [whatsappOTP, setWhatsappOTP] = useState("")
  const [whatsappStep, setWhatsappStep] = useState<'phone' | 'otp' | null>(null)
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

  const handleWhatsAppStart = () => {
    setWhatsappStep('phone')
  }

  const handleWhatsAppSendOTP = async () => {
    if (!whatsappPhone) {
      toast({
        title: "Errore",
        description: "Inserisci un numero di telefono valido",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await sendWhatsAppOTP(whatsappPhone)
      setWhatsappStep('otp')
      toast({
        title: "Codice inviato! 📱",
        description: "Controlla il tuo WhatsApp per il codice di verifica.",
      })
    } catch (error: any) {
      console.error('Errore invio OTP WhatsApp:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile inviare il codice. Verifica il numero.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsAppVerify = async () => {
    if (!whatsappOTP) {
      toast({
        title: "Errore",
        description: "Inserisci il codice di verifica",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyWhatsAppOTP(whatsappPhone, whatsappOTP)
      
      if (result.success) {
        toast({
          title: "Successo! ✅",
          description: "Accesso effettuato con WhatsApp.",
        })
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 1000)
      } else {
        toast({
          title: "Codice non valido",
          description: result.error || "Verifica e riprova.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error('Errore verifica OTP:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile verificare il codice.",
        variant: "destructive",
      })
    } finally {
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

            {/* WhatsApp Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#25D366]/90 border-[#25D366]"
              onClick={handleWhatsAppStart}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {isLoading ? 'Connessione...' : 'Continua con WhatsApp'}
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

          {/* WhatsApp Authentication Flow */}
          {whatsappStep && (
            <div className="border-2 border-green-500 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-700">Accedi con WhatsApp</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setWhatsappStep(null)}
                >
                  ✕
                </Button>
              </div>

              {whatsappStep === 'phone' && (
                <div className="space-y-3">
                  <Label htmlFor="whatsapp-phone">Numero di Telefono</Label>
                  <Input
                    id="whatsapp-phone"
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+39 123 456 7890"
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleWhatsAppSendOTP}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Invio...' : 'Invia Codice WhatsApp'}
                  </Button>
                  <p className="text-xs text-gray-600">
                    Riceverai un codice di verifica via SMS/WhatsApp
                  </p>
                </div>
              )}

              {whatsappStep === 'otp' && (
                <div className="space-y-3">
                  <Label htmlFor="whatsapp-otp">Codice di Verifica</Label>
                  <Input
                    id="whatsapp-otp"
                    type="text"
                    value={whatsappOTP}
                    onChange={(e) => setWhatsappOTP(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleWhatsAppVerify}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Verifica...' : 'Verifica Codice'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setWhatsappStep('phone')}
                    className="w-full"
                  >
                    Cambia numero
                  </Button>
                </div>
              )}
            </div>
          )}

          {!whatsappStep && (
            <>
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
            </>
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