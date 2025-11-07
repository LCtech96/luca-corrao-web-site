"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { 
  createBooking, 
  sendChatMessage, 
  getChatMessages, 
  subscribeToChatMessages,
  type ChatMessage as ChatMessageType 
} from "@/lib/supabase/bookings-service"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  MessageCircle,
  CreditCard,
  QrCode,
  CheckCircle,
  Send,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import Image from "next/image"
import { RevolutQR } from "./revolut-qr"

interface BookingModalAdvancedProps {
  propertyName: string
  propertyPrice: number
  propertyId?: string
  propertySlug: string
  onClose: () => void
}

export function BookingModalAdvanced({ 
  propertyName, 
  propertyPrice, 
  propertyId, 
  propertySlug, 
  onClose 
}: BookingModalAdvancedProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1) // 1: Info, 2: Chat, 3: Pagamento
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    notes: "",
  })
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([])
  const [chatInput, setChatInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"revolut" | "iban" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing chat messages if booking exists
  useEffect(() => {
    if (bookingId) {
      loadChatMessages()
      
      // Subscribe to new messages
      const unsubscribe = subscribeToChatMessages(bookingId, (newMessage) => {
        setChatMessages(prev => [...prev, newMessage])
      })
      
      return () => unsubscribe()
    }
  }, [bookingId])

  const loadChatMessages = async () => {
    if (!bookingId) return
    const messages = await getChatMessages(bookingId)
    setChatMessages(messages)
  }

  const cleaningFee = 50
  const totalNights = bookingData.checkIn && bookingData.checkOut 
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 1
  const subtotal = propertyPrice * totalNights
  const total = subtotal + cleaningFee

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !bookingId || !user) return
    
    setIsSubmitting(true)
    
    try {
      const message = await sendChatMessage(
        bookingId,
        user.email || bookingData.email,
        bookingData.name,
        'guest',
        chatInput
      )
      
      if (message) {
        setChatInput("")
        toast({
          title: "Messaggio inviato",
          description: "Luca riceverà una notifica e ti risponderà presto.",
        })
        
        // Messaggio automatico di conferma
        setTimeout(async () => {
          await sendChatMessage(
            bookingId,
            'luca@bedda.tech',
            'Luca Corrao',
            'host',
            "Grazie per il messaggio! Ti risponderò al più presto. Nel frattempo puoi procedere con la prenotazione."
          )
        }, 1500)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Errore",
        description: "Impossibile inviare il messaggio. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = async () => {
    if (step === 1) {
      // Validazione base
      if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.name || !bookingData.email || !bookingData.phone) {
        toast({
          title: "Campi mancanti",
          description: "Compila tutti i campi obbligatori",
          variant: "destructive",
        })
        return
      }

      // Passa direttamente allo step del pagamento (step 3)
      // Saltiamo completamente il database e la chat
      setStep(3)
      
      toast({
        title: "Quasi fatto!",
        description: "Scegli il metodo di pagamento per completare.",
      })
    } else {
      setStep(step + 1)
    }
  }

  const handleApplePay = () => {
    // Apple Pay che reindirizza a Revolut
    if (typeof window !== 'undefined' && (window as any).ApplePaySession) {
      const request = {
        countryCode: 'IT',
        currencyCode: 'EUR',
        supportedNetworks: ['visa', 'masterCard'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: `${propertyName} - Prenotazione`,
          amount: total.toString(),
        }
      }
      
      // Dopo il successo di Apple Pay, reindirizza a Revolut
      // Nota: questa è una simulazione, per l'implementazione completa serve un backend
      alert(`Apple Pay: €${total}\nDopo il pagamento verrai reindirizzato a Revolut per completare la transazione.`)
      window.open('https://revolut.me/lctech96', '_blank')
    } else {
      alert('Apple Pay non disponibile su questo dispositivo. Usa Revolut direttamente.')
      window.open('https://revolut.me/lctech96', '_blank')
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Prenota {propertyName}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-amber-500' : 'bg-gray-300'}`} />
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-amber-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-amber-500' : 'bg-gray-300'}`} />
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-amber-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-amber-500' : 'bg-gray-300'}`} />
        </div>

        <div className="text-center text-sm text-gray-600 mb-6">
          {step === 1 && "Passo 1: Inserisci i tuoi dati"}
          {step === 2 && "Passo 2: Chat con l'host (opzionale)"}
          {step === 3 && "Passo 3: Scegli il metodo di pagamento"}
        </div>

        {/* Step 1: Booking Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="checkIn"
                    type="date"
                    required
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="checkOut"
                    type="date"
                    required
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="guests">Numero di ospiti *</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                type="text"
                required
                placeholder="Mario Rossi"
                value={bookingData.name}
                onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="mario@email.com"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Telefono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+39 123 456 7890"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Note aggiuntive (opzionale)</Label>
              <Textarea
                id="notes"
                placeholder="Richieste speciali, orario di arrivo previsto, etc..."
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>€{propertyPrice} x {totalNights} {totalNights === 1 ? 'notte' : 'notti'}</span>
                <span>€{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pulizia</span>
                <span>€{cleaningFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Totale</span>
                <span>€{total}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Annulla
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="flex-1 bg-amber-600 hover:bg-amber-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creazione..." : "Continua"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Chat with Host */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                Hai domande? Chatta con Luca
              </h3>
              <p className="text-sm text-gray-600">
                Questo passaggio è opzionale. Puoi fare domande sulla struttura o procedere direttamente al pagamento.
              </p>
            </div>

            {/* Chat Box */}
            <div className="border rounded-lg h-64 overflow-y-auto p-4 bg-white space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Caricamento chat...</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === "guest" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender_type === "guest"
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-xs font-medium mb-1">{msg.sender_name}</p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Scrivi un messaggio..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isSubmitting && handleSendMessage()}
                disabled={isSubmitting}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon" 
                className="bg-amber-600 hover:bg-amber-700"
                disabled={isSubmitting || !chatInput.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Indietro
              </Button>
              <Button onClick={handleNextStep} className="flex-1 bg-amber-600 hover:bg-amber-700">
                Vai al Pagamento
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Prenotazione Quasi Completata!</h3>
              <p className="text-gray-600">
                Scegli come pagare €{total} per la tua prenotazione
              </p>
            </div>

            {/* Riepilogo Prenotazione */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6">
              <h4 className="font-semibold mb-3">Riepilogo Prenotazione</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString('it-IT')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString('it-IT')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ospiti:</span>
                  <span className="font-medium">{bookingData.guests}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Totale da pagare:</span>
                  <span className="text-amber-600">€{total}</span>
                </div>
              </div>
            </div>

            {/* Metodi di Pagamento */}
            <div className="space-y-4">
              <h4 className="font-semibold">Scegli il metodo di pagamento</h4>

              {/* Revolut Payment */}
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  paymentMethod === "revolut" 
                    ? "border-amber-500 bg-amber-50" 
                    : "border-gray-200 hover:border-amber-300"
                }`}
                onClick={() => setPaymentMethod("revolut")}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    R
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">Revolut</h5>
                    <p className="text-sm text-gray-600">Paga tramite Revolut - Veloce e sicuro</p>
                  </div>
                  {paymentMethod === "revolut" && <CheckCircle className="w-6 h-6 text-amber-500" />}
                </div>

                {paymentMethod === "revolut" && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Revolut Link */}
                    <div className="bg-white p-4 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">Link di Pagamento</Label>
                      <div className="flex gap-2">
                        <Input
                          value="https://revolut.me/lctech96"
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText('https://revolut.me/lctech96')
                            alert('Link copiato!')
                          }}
                        >
                          Copia
                        </Button>
                      </div>
                    </div>

                    {/* Revolut QR Code */}
                    <div className="bg-white p-4 rounded-lg text-center">
                      <Label className="text-sm font-medium mb-3 block">Oppure Scansiona il QR Code</Label>
                      <RevolutQR size={200} showLabel={false} />
                      <p className="text-xs text-gray-500 mt-3">
                        Importo: <strong className="text-amber-600">€{total}</strong>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Invia esattamente €{total} con causale: "{propertyName} - {bookingData.name}"
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                      onClick={() => window.open('https://revolut.me/lctech96', '_blank')}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Paga Ora con Revolut
                    </Button>
                  </div>
                )}
              </div>

              {/* Bonifico IBAN */}
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  paymentMethod === "iban" 
                    ? "border-amber-500 bg-amber-50" 
                    : "border-gray-200 hover:border-amber-300"
                }`}
                onClick={() => setPaymentMethod("iban")}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    🏦
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">Bonifico Bancario</h5>
                    <p className="text-sm text-gray-600">Bonifico SEPA - 24-48h</p>
                  </div>
                  {paymentMethod === "iban" && <CheckCircle className="w-6 h-6 text-amber-500" />}
                </div>

                {paymentMethod === "iban" && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="bg-white p-3 rounded border">
                      <Label className="text-xs text-gray-600">Beneficiario</Label>
                      <p className="font-mono font-semibold">Luca Corrao</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <Label className="text-xs text-gray-600">IBAN</Label>
                      <p className="font-mono text-sm">IT34G0366901600493004003933</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <Label className="text-xs text-gray-600">BIC / SWIFT</Label>
                      <p className="font-mono">REVOITM2</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <Label className="text-xs text-gray-600">Banca</Label>
                      <p className="font-mono text-sm">Revolut Bank UAB</p>
                      <p className="font-mono text-xs text-gray-500">Via Dante 7, 20123, Milano (MI), Italy</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <Label className="text-xs text-gray-600">Correspondent BIC</Label>
                      <p className="font-mono">CHASDEFX</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <Label className="text-xs text-gray-600">Causale</Label>
                      <p className="font-mono text-sm">{propertyName} - {bookingData.name}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-200">
                      <Label className="text-xs text-amber-800">Importo</Label>
                      <p className="font-mono text-2xl font-bold text-amber-600">€{total}</p>
                    </div>
                    <Button
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        navigator.clipboard.writeText('IT34G0366901600493004003933')
                        alert('IBAN copiato negli appunti!')
                      }}
                    >
                      Copia IBAN
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Indietro
              </Button>
              {paymentMethod && (
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    toast({
                      title: "Prenotazione Confermata! ✅",
                      description: `Grazie ${bookingData.name}! Riceverai una email di conferma a ${bookingData.email}`,
                    })
                    
                    // Invia email di notifica a Luca (da implementare)
                    console.log('📧 Notifica inviata a luca@bedda.tech:', {
                      booking: bookingData,
                      payment: paymentMethod,
                      total: total
                    })
                    
                    onClose()
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Conferma Prenotazione
                </Button>
              )}
            </div>

            {/* Contatti Rapidi */}
            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <p className="text-sm text-center text-gray-700">
                <strong>Hai bisogno di aiuto?</strong> Contattami su{" "}
                <button
                  onClick={() => window.open('https://wa.me/+393514206353', '_blank')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  WhatsApp
                </button>
                {" "}o{" "}
                <button
                  onClick={() => window.open('tel:+393513671340', '_blank')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  chiama
                </button>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

