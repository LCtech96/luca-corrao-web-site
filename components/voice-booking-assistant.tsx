"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Calendar,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Bot,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"

interface VoiceBookingAssistantProps {
  onClose: () => void
}

interface BookingData {
  propertyId: string
  propertyName: string
  checkIn: string
  checkOut: string
  guests: number
  guestName: string
  guestSurname: string
  guestPhone: string
  guestEmail: string
  specialRequests: string
}

const properties = [
  {
    id: "lucas-suite",
    name: "Lucas Suite",
    subtitle: "Romantica per Due",
    capacity: 2,
    price: "€95/notte",
    image: "/images/bedroom-historic-1.jpg",
    features: ["Affreschi storici", "Centro storico", "30m da Piazza Duomo", "350m dal mare"],
    description: "Esperienza artistica unica con affreschi storici sui soffitti",
  },
  {
    id: "lucas-rooftop",
    name: "Lucas Rooftop",
    subtitle: "Panoramica per Famiglie",
    capacity: 5,
    price: "€120/notte",
    image: "/images/lucas-rooftop-terrace.jpg",
    features: ["Terrazza panoramica", "Pet-friendly", "50m da Piazza Duomo", "300m dal mare"],
    description: "Tramonti mozzafiato dalla terrazza panoramica privata",
  },
]

export function VoiceBookingAssistant({ onClose }: VoiceBookingAssistantProps) {
  const [currentStep, setCurrentStep] = useState<"property" | "dates" | "details" | "confirmation">("property")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [speechSupported, setSpeechSupported] = useState(true)
  const [bookingData, setBookingData] = useState<BookingData>({
    propertyId: "",
    propertyName: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    guestName: "",
    guestSurname: "",
    guestPhone: "",
    guestEmail: "",
    specialRequests: "",
  })

  const recognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesisRef.current = window.speechSynthesis

      // Check for Speech Recognition support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "it-IT"

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase()
          handleVoiceCommand(transcript)
        }

        recognition.onend = () => setIsListening(false)
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          if (event.error === "not-allowed") {
            speakText("Per favore, consenti l'accesso al microfono per utilizzare i comandi vocali.")
          }
        }
      } else {
        setSpeechSupported(false)
        console.warn("Speech Recognition not supported in this browser")
      }
    }

    // Welcome message
    setTimeout(() => {
      speakText(
        "Benvenuto nell'assistente vocale per prenotazioni! Ti guiderò passo dopo passo. Iniziamo scegliendo la struttura perfetta per te.",
      )
    }, 500)

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel()
      }
    }
  }, [])

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current) return

    speechSynthesisRef.current.cancel()

    const cleanText = text
      .replace(/[🌟🚀🏛️🏖️🎨💊🧺🛒✈️🌅🐕💰📋🎯👤🤖⚡📱💡✅🔥]/gu, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/•/g, "")
      .trim()

    if (cleanText.length === 0) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 0.8
    utterance.lang = "it-IT"

    const voices = speechSynthesisRef.current.getVoices()
    const italianVoice = voices.find((voice) => voice.lang.startsWith("it"))
    if (italianVoice) {
      utterance.voice = italianVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesisRef.current.speak(utterance)
  }

  const startListening = () => {
    if (!speechSupported) {
      speakText(
        "Il riconoscimento vocale non è supportato in questo browser. Puoi comunque utilizzare l'interfaccia cliccando sui pulsanti.",
      )
      return
    }

    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true)
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setIsListening(false)
        speakText("Errore nell'avvio del riconoscimento vocale. Prova di nuovo.")
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleVoiceCommand = (transcript: string) => {
    console.log("Voice command:", transcript)

    if (currentStep === "property") {
      if (transcript.includes("suite") || transcript.includes("romantica") || transcript.includes("due")) {
        selectProperty("lucas-suite")
      } else if (transcript.includes("rooftop") || transcript.includes("terrazza") || transcript.includes("famiglia")) {
        selectProperty("lucas-rooftop")
      } else {
        speakText(
          "Non ho capito. Puoi dire 'Lucas Suite' per la camera romantica o 'Lucas Rooftop' per quella con terrazza?",
        )
      }
    } else if (currentStep === "dates") {
      handleDateVoiceCommand(transcript)
    } else if (currentStep === "details") {
      handleDetailsVoiceCommand(transcript)
    }
  }

  const selectProperty = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId)
    if (property) {
      setBookingData((prev) => ({
        ...prev,
        propertyId: property.id,
        propertyName: property.name,
      }))
      setCurrentStep("dates")
      speakText(`Perfetto! Hai scelto ${property.name}. Ora dimmi le date del tuo soggiorno. Quando vuoi arrivare?`)
    }
  }

  const handleDateVoiceCommand = (transcript: string) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (transcript.includes("oggi")) {
      setBookingData((prev) => ({ ...prev, checkIn: today.toISOString().split("T")[0] }))
      speakText("Check-in impostato per oggi. Quando vuoi partire?")
    } else if (transcript.includes("domani")) {
      if (!bookingData.checkIn) {
        setBookingData((prev) => ({ ...prev, checkIn: tomorrow.toISOString().split("T")[0] }))
        speakText("Check-in impostato per domani. Quando vuoi partire?")
      } else {
        const checkOut = new Date(bookingData.checkIn)
        checkOut.setDate(checkOut.getDate() + 1)
        setBookingData((prev) => ({ ...prev, checkOut: checkOut.toISOString().split("T")[0] }))
        proceedToDetails()
      }
    } else if (transcript.includes("prossima settimana")) {
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)
      if (!bookingData.checkIn) {
        setBookingData((prev) => ({ ...prev, checkIn: nextWeek.toISOString().split("T")[0] }))
        speakText("Check-in impostato per la prossima settimana. Quando vuoi partire?")
      }
    } else if (transcript.includes("continua") || transcript.includes("avanti")) {
      if (bookingData.checkIn && bookingData.checkOut) {
        proceedToDetails()
      } else {
        speakText("Devi ancora selezionare le date. Dimmi quando vuoi arrivare e partire.")
      }
    } else {
      speakText(
        "Puoi dire 'oggi', 'domani', 'prossima settimana' o seleziona le date dal calendario. Poi di' 'continua' per procedere.",
      )
    }
  }

  const proceedToDetails = () => {
    setCurrentStep("details")
    speakText("Perfetto! Ora ho bisogno dei tuoi dati. Dimmi il tuo nome e cognome.")
  }

  const handleDetailsVoiceCommand = (transcript: string) => {
    if (!bookingData.guestName && !bookingData.guestSurname) {
      const words = transcript.split(" ")
      if (words.length >= 2) {
        setBookingData((prev) => ({
          ...prev,
          guestName: words[0],
          guestSurname: words.slice(1).join(" "),
        }))
        speakText(`Perfetto ${words[0]}! Ora dimmi il tuo numero di telefono.`)
      } else {
        speakText("Dimmi nome e cognome, per favore.")
      }
    } else if (!bookingData.guestPhone) {
      const phoneMatch = transcript.match(/\d+/g)
      if (phoneMatch) {
        const phone = phoneMatch.join("")
        setBookingData((prev) => ({ ...prev, guestPhone: phone }))
        speakText("Numero salvato! Ora dimmi la tua email.")
      } else {
        speakText("Non ho sentito un numero. Ripeti il tuo telefono, per favore.")
      }
    } else if (!bookingData.guestEmail) {
      if (transcript.includes("@") || transcript.includes("chiocciola")) {
        const email = transcript.replace("chiocciola", "@").replace(" ", "")
        setBookingData((prev) => ({ ...prev, guestEmail: email }))
        speakText("Email salvata! Hai richieste speciali? Altrimenti di' 'no' per continuare.")
      } else {
        speakText("Dimmi la tua email, per favore.")
      }
    } else {
      if (transcript.includes("no") || transcript.includes("niente") || transcript.includes("continua")) {
        setCurrentStep("confirmation")
        speakText("Perfetto! Ora ti mostro il riepilogo della prenotazione.")
      } else {
        setBookingData((prev) => ({ ...prev, specialRequests: transcript }))
        setCurrentStep("confirmation")
        speakText("Richiesta salvata! Ora ti mostro il riepilogo.")
      }
    }
  }

  const handleDateSelect = (date: string) => {
    if (!bookingData.checkIn) {
      setBookingData((prev) => ({ ...prev, checkIn: date }))
      speakText("Data di arrivo selezionata. Ora scegli la data di partenza.")
    } else if (!bookingData.checkOut) {
      if (new Date(date) > new Date(bookingData.checkIn)) {
        setBookingData((prev) => ({ ...prev, checkOut: date }))
        speakText("Date confermate! Procediamo con i tuoi dati.")
        setTimeout(() => proceedToDetails(), 1000)
      } else {
        speakText("La data di partenza deve essere dopo quella di arrivo.")
      }
    }
  }

  const sendBookingConfirmation = () => {
    const selectedProperty = properties.find((p) => p.id === bookingData.propertyId)
    const nights = Math.ceil(
      (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
    )

    const message = `🏨 PRENOTAZIONE ASSISTITA VOCALMENTE - ${bookingData.propertyName}

✨ DETTAGLI SOGGIORNO:
🏠 Struttura: ${bookingData.propertyName}
📅 Check-in: ${new Date(bookingData.checkIn).toLocaleDateString("it-IT")}
📅 Check-out: ${new Date(bookingData.checkOut).toLocaleDateString("it-IT")}
🌙 Notti: ${nights}
👥 Ospiti: ${bookingData.guests}

👤 INFORMAZIONI OSPITE:
Nome: ${bookingData.guestName} ${bookingData.guestSurname}
📞 Telefono: ${bookingData.guestPhone}
📧 Email: ${bookingData.guestEmail}

💰 PREZZO STIMATO:
${selectedProperty?.price} × ${nights} notti
+ €25 pulizie finali

💬 Richieste speciali: ${bookingData.specialRequests || "Nessuna"}

🎤 Prenotazione completata tramite assistente vocale AI!`

    const whatsappUrl1 = `https://wa.me/+393514206353?text=${encodeURIComponent(message)}`
    const whatsappUrl2 = `https://wa.me/+393513671340?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl1, "_blank")
    setTimeout(() => window.open(whatsappUrl2, "_blank"), 1000)

    speakText(
      "Prenotazione inviata! Ti contatteremo su WhatsApp per la conferma. Grazie per aver scelto le strutture di Luca Corrao!",
    )

    setTimeout(() => onClose(), 3000)
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const today = new Date()

    const days = []
    const monthNames = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ]

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const isPast = new Date(date) < today
      const isSelected = date === bookingData.checkIn || date === bookingData.checkOut

      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateSelect(date)}
          disabled={isPast}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
            isPast
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isSelected
                ? "bg-purple-600 text-white"
                : "hover:bg-purple-100 text-gray-700"
          }`}
        >
          {day}
        </button>,
      )
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {monthNames[month]} {year}
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"].map((day) => (
            <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                <Bot className="w-6 h-6 text-purple-600" />
                Assistente Vocale per Prenotazioni
              </CardTitle>
              <p className="text-gray-600 mt-2">Ti guido passo dopo passo con comandi vocali</p>
              {!speechSupported && (
                <div className="flex items-center gap-2 mt-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Riconoscimento vocale non supportato - usa i pulsanti</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Voice Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={isListening ? stopListening : startListening}
                disabled={!speechSupported}
                className={`${isListening ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-600"} ${!speechSupported ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? "Stop" : "Parla"}
              </Button>

              {isSpeaking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopSpeaking}
                  className="bg-orange-50 border-orange-200 text-orange-600"
                >
                  <VolumeX className="w-4 h-4" />
                  Zitto
                </Button>
              )}

              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {["property", "dates", "details", "confirmation"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === step ||
                    (index < ["property", "dates", "details", "confirmation"].indexOf(currentStep))
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index < ["property", "dates", "details", "confirmation"].indexOf(currentStep)
                        ? "bg-gradient-to-r from-purple-500 to-blue-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === "property" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Scegli la Tua Struttura</h3>
                <p className="text-gray-600">Clicca su una struttura o usa i comandi vocali</p>
                {speechSupported && (
                  <div className="bg-purple-50 p-3 rounded-lg mt-4">
                    <p className="text-sm text-purple-800">
                      🎤 <strong>Comandi vocali:</strong> "Lucas Suite" o "Lucas Rooftop"
                    </p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <Card
                    key={property.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      bookingData.propertyId === property.id ? "ring-2 ring-purple-500 bg-purple-50" : ""
                    }`}
                    onClick={() => selectProperty(property.id)}
                  >
                    <div className="relative h-48">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-purple-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900">{property.name}</h4>
                      <p className="text-purple-600 font-medium">{property.subtitle}</p>
                      <p className="text-gray-600 mt-2">{property.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-gray-900">{property.price}</span>
                        <span className="text-sm text-gray-500">Max {property.capacity} ospiti</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === "dates" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Seleziona le Date</h3>
                <p className="text-gray-600">Clicca sul calendario o usa i comandi vocali</p>
                {speechSupported && (
                  <div className="bg-purple-50 p-3 rounded-lg mt-4">
                    <p className="text-sm text-purple-800">
                      🎤 <strong>Comandi vocali:</strong> "oggi", "domani", "prossima settimana", poi "continua"
                    </p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>{renderCalendar()}</div>
                <div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Date Selezionate</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Check-in: {bookingData.checkIn || "Seleziona data"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Check-out: {bookingData.checkOut || "Seleziona data"}</span>
                      </div>
                    </div>
                  </div>

                  {bookingData.checkIn && bookingData.checkOut && (
                    <Button onClick={proceedToDetails} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                      Continua con i Dati
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === "details" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I Tuoi Dati</h3>
                <p className="text-gray-600">Compila i campi o usa i comandi vocali</p>
                {speechSupported && (
                  <div className="bg-purple-50 p-3 rounded-lg mt-4">
                    <p className="text-sm text-purple-800">
                      🎤 <strong>Comandi vocali:</strong> Dimmi nome, telefono, email uno alla volta
                    </p>
                  </div>
                )}
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName">Nome *</Label>
                    <Input
                      id="guestName"
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, guestName: e.target.value }))}
                      placeholder="Il tuo nome"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestSurname">Cognome *</Label>
                    <Input
                      id="guestSurname"
                      value={bookingData.guestSurname}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, guestSurname: e.target.value }))}
                      placeholder="Il tuo cognome"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestPhone">Telefono *</Label>
                    <Input
                      id="guestPhone"
                      value={bookingData.guestPhone}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, guestPhone: e.target.value }))}
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email *</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={bookingData.guestEmail}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, guestEmail: e.target.value }))}
                      placeholder="tua@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests">Numero Ospiti</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={properties.find((p) => p.id === bookingData.propertyId)?.capacity || 5}
                    value={bookingData.guests}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, guests: Number.parseInt(e.target.value) }))}
                  />
                </div>

                {bookingData.guestName &&
                  bookingData.guestSurname &&
                  bookingData.guestPhone &&
                  bookingData.guestEmail && (
                    <Button
                      onClick={() => setCurrentStep("confirmation")}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Vai al Riepilogo
                    </Button>
                  )}
              </div>
            </div>
          )}

          {currentStep === "confirmation" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Conferma Prenotazione</h3>
                <p className="text-gray-600">Verifica tutti i dettagli prima di inviare</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-4 text-lg">📋 Riepilogo Completo</h4>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-purple-800">🏨 Struttura</h5>
                      <p className="text-purple-700">{bookingData.propertyName}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-purple-800">📅 Date</h5>
                      <p className="text-purple-700">
                        {new Date(bookingData.checkIn).toLocaleDateString("it-IT")} -{" "}
                        {new Date(bookingData.checkOut).toLocaleDateString("it-IT")}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-purple-800">👤 Ospite</h5>
                      <p className="text-purple-700">
                        {bookingData.guestName} {bookingData.guestSurname}
                      </p>
                      <p className="text-sm text-purple-600">
                        {bookingData.guestPhone} • {bookingData.guestEmail}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-purple-800">👥 Ospiti</h5>
                      <p className="text-purple-700">{bookingData.guests} persone</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={sendBookingConfirmation}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Conferma e Invia Prenotazione
                </Button>
              </div>
            </div>
          )}

          {/* Voice Status */}
          {(isListening || isSpeaking) && (
            <div className="fixed bottom-4 right-4 bg-white border-2 border-purple-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2">
                {isListening && (
                  <>
                    <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-red-600">Sto ascoltando...</span>
                  </>
                )}
                {isSpeaking && (
                  <>
                    <Volume2 className="w-5 h-5 text-blue-500 animate-pulse" />
                    <span className="text-sm font-medium text-blue-600">Sto parlando...</span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
