"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Phone, CheckCircle, X, AlertCircle } from "lucide-react"
import { enable2FA, verify2FACode, disable2FA, get2FAFactors } from "@/lib/supabase/auth-service"
import { useToast } from "@/hooks/use-toast"

export function TwoFactorSetup() {
  const { toast } = useToast()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [factorId, setFactorId] = useState<string | null>(null)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkExisting2FA()
  }, [])

  const checkExisting2FA = async () => {
    try {
      const factors = await get2FAFactors()
      const phoneFactor = factors?.all?.find(f => f.factor_type === 'phone')
      
      if (phoneFactor) {
        setIs2FAEnabled(true)
        setFactorId(phoneFactor.id)
      }
    } catch (error) {
      console.error('Error checking 2FA:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    if (!phoneNumber) {
      toast({
        title: "Numero richiesto",
        description: "Inserisci il tuo numero di telefono.",
        variant: "destructive",
      })
      return
    }

    setIsEnrolling(true)

    try {
      const data = await enable2FA(phoneNumber)
      
      if (data) {
        setFactorId(data.id)
        toast({
          title: "Codice inviato! 📱",
          description: `Controlla il tuo telefono ${phoneNumber}`,
        })
      }
    } catch (error: any) {
      console.error('2FA enable error:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile abilitare 2FA. Verifica che Phone Auth sia configurato in Supabase.",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || !factorId) {
      toast({
        title: "Codice richiesto",
        description: "Inserisci il codice ricevuto via SMS.",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      await verify2FACode(factorId, verificationCode)
      
      setIs2FAEnabled(true)
      setVerificationCode("")
      toast({
        title: "2FA Attivato! ✅",
        description: "La verifica a due fattori è ora attiva sul tuo account.",
      })
    } catch (error: any) {
      console.error('2FA verify error:', error)
      toast({
        title: "Codice non valido",
        description: error.message || "Il codice inserito non è corretto. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!factorId) return

    const confirmed = confirm("Sei sicuro di voler disabilitare la verifica a due fattori?")
    if (!confirmed) return

    try {
      await disable2FA(factorId)
      
      setIs2FAEnabled(false)
      setFactorId(null)
      setPhoneNumber("")
      toast({
        title: "2FA Disattivato",
        description: "La verifica a due fattori è stata disabilitata.",
      })
    } catch (error: any) {
      console.error('2FA disable error:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile disabilitare 2FA. Riprova.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg border space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">Verifica a Due Fattori (2FA)</h3>
          <p className="text-sm text-gray-600">
            Aggiungi un ulteriore livello di sicurezza al tuo account con SMS o WhatsApp.
          </p>
        </div>
        {is2FAEnabled && (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        )}
      </div>

      {!is2FAEnabled ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Numero di Telefono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+39 123 456 7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
                disabled={isEnrolling || !!factorId}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Include il prefisso internazionale (es. +39 per Italia)
            </p>
          </div>

          {!factorId ? (
            <Button
              onClick={handleEnable2FA}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isEnrolling}
            >
              {isEnrolling ? "Invio codice..." : "Abilita 2FA"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Codice inviato!</strong> Controlla il tuo telefono e inserisci il codice a 6 cifre.
                </p>
              </div>

              <div>
                <Label htmlFor="code">Codice di Verifica</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isVerifying}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFactorId(null)
                    setVerificationCode("")
                  }}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Annulla
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={isVerifying || verificationCode.length !== 6}
                >
                  {isVerifying ? "Verifica..." : "Verifica Codice"}
                </Button>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <strong>Nota:</strong> La 2FA via SMS/WhatsApp richiede la configurazione di un provider SMS (Twilio/MessageBird) nel pannello Supabase.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">2FA Attivo</p>
                <p className="text-sm text-green-700">
                  Il tuo account è protetto con verifica a due fattori.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDisable2FA}
            variant="destructive"
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Disabilita 2FA
          </Button>
        </div>
      )}
    </div>
  )
}

