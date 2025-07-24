"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  MapPin,
  Star,
  Check,
  Building2,
  Sparkles,
  Heart,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"

interface GuidedBookingWorkflowProps {
  onClose: () => void
}

interface BookingData {
  step: number
  selectedProperty: string
  propertyName: string
  checkIn: string
  checkOut: string
  guests: number
  hasPets: boolean
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
    capacity: "2 persone",
    highlight: "Affreschi storici unici",
    distance: "30m da Piazza Duomo • 350m dal mare",
    image: "/images/bedroom-historic-1.jpg",
    features: ["Affreschi storici", "Design moderno", "Centro storico", "Romantica"],
    price: "€95/notte",
    cleaningFee: 25,
    petsAllowed: false,
    description: "Un'esperienza artistica irripetibile con affreschi storici sui soffitti",
  },
  {
    id: "lucas-rooftop",
    name: "Lucas Rooftop",
    subtitle: "Panoramica per Famiglie",
    capacity: "4+1 persone",
    highlight: "Terrazza panoramica mozzafiato",
    distance: "50m da Piazza Duomo • 300m dal mare",
    image: "/images/lucas-rooftop-terrace.jpg",
    features: ["Terrazza panoramica", "Lavatrice inclusa", "Spazio ampio", "Vista mare", "Pet-friendly"],
    price: "€120/notte",
    cleaningFee: 25,
    petsAllowed: true,
    petSupplement: 20,
    description: "Tramonti indimenticabili dalla terrazza panoramica privata",
  },
]

export function GuidedBookingWorkflow({ onClose }: GuidedBookingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    step: 1,
    selectedProperty: "",
    propertyName: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    hasPets: false,
    guestName: "",
    guestSurname: "",
    guestPhone: "",
    guestEmail: "",
    specialRequests: "",
  })

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setBookingData({ ...bookingData, step: currentStep + 1 })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setBookingData({ ...bookingData, step: currentStep - 1 })
    }
  }

  const handlePropertySelect = (propertyId: string, propertyName: string) => {
    setBookingData({
      ...bookingData,
      selectedProperty: propertyId,
      propertyName: propertyName,
    })
  }

  const handleDateChange = (field: "checkIn" | "checkOut", value: string) => {
    setBookingData({ ...bookingData, [field]: value })
  }

  const handleGuestInfoChange = (field: string, value: string | number | boolean) => {
    setBookingData({ ...bookingData, [field]: value })
  }

  const handleFinalSubmit = () => {
    const selectedProp = properties.find((p) => p.id === bookingData.selectedProperty)
    const nights = Math.ceil(
      (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
    )

    const basePrice = selectedProp?.id === "lucas-suite" ? 95 : 120
    const cleaningFee = selectedProp?.cleaningFee || 25
    const petSupplement = bookingData.hasPets && selectedProp?.petsAllowed ? selectedProp?.petSupplement || 0 : 0
    const totalPrice = basePrice * nights + cleaningFee + petSupplement

    const message = `🏨 PRENOTAZIONE GUIDATA - ${bookingData.propertyName}

✨ DETTAGLI SOGGIORNO:
🏠 Struttura: ${bookingData.propertyName}
📅 Check-in: ${bookingData.checkIn}
📅 Check-out: ${bookingData.checkOut}
🌙 Notti: ${nights}
👥 Ospiti: ${bookingData.guests}
${bookingData.hasPets ? "🐕 Con animale domestico" : ""}

👤 INFORMAZIONI OSPITE:
Nome: ${bookingData.guestName} ${bookingData.guestSurname}
📞 Telefono: ${bookingData.guestPhone}
📧 Email: ${bookingData.guestEmail}

💰 DETTAGLIO PREZZO:
Soggiorno (€${basePrice} × ${nights} notti): €${basePrice * nights}
Pulizie finali: €${cleaningFee}
${bookingData.hasPets && selectedProp?.petsAllowed ? `Supplemento animale: €${petSupplement}` : ""}
TOTALE: €${totalPrice}

💬 Richieste speciali: ${bookingData.specialRequests || "Nessuna"}

🎯 Prenotazione completata tramite workflow guidato!`

    const whatsappUrl1 = `https://wa.me/+393514206353?text=${encodeURIComponent(message)}`
    const whatsappUrl2 = `https://wa.me/+393513671340?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl1, "_blank")
    setTimeout(() => window.open(whatsappUrl2, "_blank"), 1000)

    alert("🎉 Prenotazione inviata! Ti contatteremo su WhatsApp per la conferma.")
    onClose()
  }

  const canProceedStep1 = bookingData.selectedProperty !== ""
  const canProceedStep2 = bookingData.checkIn !== "" && bookingData.checkOut !== "" && bookingData.guests > 0
  const canProceedStep3 =
    bookingData.guestName !== "" &&
    bookingData.guestSurname !== "" &&
    bookingData.guestPhone !== "" &&
    bookingData.guestEmail !== ""

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              i + 1 <= currentStep
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {i + 1 <= currentStep ? <Check className="w-5 h-5" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-16 h-1 mx-2 ${
                i + 1 < currentStep ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building2 className="w-8 h-8 text-amber-600" />
          <h3 className="text-2xl font-bold text-gray-900">Scegli la Tua Esperienza</h3>
        </div>
        <p className="text-gray-600">Seleziona la struttura perfetta per il tuo soggiorno da sogno</p>
      </div>

      <div className="grid gap-6">
        {properties.map((property) => (
          <Card
            key={property.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              bookingData.selectedProperty === property.id ? "ring-2 ring-amber-500 bg-amber-50" : "hover:shadow-lg"
            }`}
            onClick={() => handlePropertySelect(property.id, property.name)}
          >
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-48 md:h-full">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    fill
                    className="object-cover rounded-l-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  {bookingData.selectedProperty === property.id && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center rounded-l-lg">
                      <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{property.name}</h4>
                      <p className="text-amber-600 font-medium">{property.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{property.price}</p>
                      <p className="text-sm text-gray-500">a notte</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{property.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-amber-600" />
                      {property.capacity}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      {property.distance}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      {property.highlight}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calendar className="w-8 h-8 text-amber-600" />
          <h3 className="text-2xl font-bold text-gray-900">Quando Vuoi Soggiornare?</h3>
        </div>
        <p className="text-gray-600">Seleziona le date del tuo soggiorno perfetto</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Building2 className="w-6 h-6 text-amber-600" />
          <h4 className="font-semibold text-amber-900">Struttura Selezionata</h4>
        </div>
        <p className="text-amber-800 font-medium">{bookingData.propertyName}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="checkIn" className="text-sm font-medium text-gray-700 mb-2 block">
            Data di Arrivo *
          </Label>
          <Input
            id="checkIn"
            type="date"
            value={bookingData.checkIn}
            onChange={(e) => handleDateChange("checkIn", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full"
            required
          />
        </div>

        <div>
          <Label htmlFor="checkOut" className="text-sm font-medium text-gray-700 mb-2 block">
            Data di Partenza *
          </Label>
          <Input
            id="checkOut"
            type="date"
            value={bookingData.checkOut}
            onChange={(e) => handleDateChange("checkOut", e.target.value)}
            min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
            className="w-full"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="guests" className="text-sm font-medium text-gray-700 mb-2 block">
          Numero di Ospiti *
        </Label>
        <Input
          id="guests"
          type="number"
          min="1"
          max={bookingData.selectedProperty === "lucas-suite" ? "2" : "5"}
          value={bookingData.guests}
          onChange={(e) => handleGuestInfoChange("guests", Number.parseInt(e.target.value))}
          className="w-full"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Massimo {bookingData.selectedProperty === "lucas-suite" ? "2" : "5"} ospiti per questa struttura
        </p>
      </div>

      {bookingData.selectedProperty === "lucas-rooftop" && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Animali Domestici</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pets"
                value="no"
                checked={!bookingData.hasPets}
                onChange={() => handleGuestInfoChange("hasPets", false)}
                className="text-amber-600"
              />
              <span className="text-sm text-gray-700">Nessun animale</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pets"
                value="yes"
                checked={bookingData.hasPets}
                onChange={() => handleGuestInfoChange("hasPets", true)}
                className="text-amber-600"
              />
              <span className="text-sm text-gray-700">Con animale domestico (+€20)</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Gli animali domestici sono ammessi solo in Lucas Rooftop con supplemento di €20
          </p>
        </div>
      )}

      {bookingData.checkIn && bookingData.checkOut && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">✅ Riepilogo Soggiorno</h4>
          <div className="space-y-1 text-sm text-green-800">
            <p>
              📅 Durata:{" "}
              {Math.ceil(
                (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}{" "}
              notti
            </p>
            <p>👥 Ospiti: {bookingData.guests}</p>
            <p>🏠 Struttura: {bookingData.propertyName}</p>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users className="w-8 h-8 text-amber-600" />
          <h3 className="text-2xl font-bold text-gray-900">I Tuoi Dati</h3>
        </div>
        <p className="text-gray-600">Inserisci le tue informazioni per completare la prenotazione</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guestName" className="text-sm font-medium text-gray-700 mb-2 block">
            Nome *
          </Label>
          <Input
            id="guestName"
            value={bookingData.guestName}
            onChange={(e) => handleGuestInfoChange("guestName", e.target.value)}
            placeholder="Il tuo nome"
            required
          />
        </div>

        <div>
          <Label htmlFor="guestSurname" className="text-sm font-medium text-gray-700 mb-2 block">
            Cognome *
          </Label>
          <Input
            id="guestSurname"
            value={bookingData.guestSurname}
            onChange={(e) => handleGuestInfoChange("guestSurname", e.target.value)}
            placeholder="Il tuo cognome"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guestPhone" className="text-sm font-medium text-gray-700 mb-2 block">
            Telefono *
          </Label>
          <Input
            id="guestPhone"
            value={bookingData.guestPhone}
            onChange={(e) => handleGuestInfoChange("guestPhone", e.target.value)}
            placeholder="+39 123 456 7890"
            required
          />
        </div>

        <div>
          <Label htmlFor="guestEmail" className="text-sm font-medium text-gray-700 mb-2 block">
            Email *
          </Label>
          <Input
            id="guestEmail"
            type="email"
            value={bookingData.guestEmail}
            onChange={(e) => handleGuestInfoChange("guestEmail", e.target.value)}
            placeholder="tua@email.com"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700 mb-2 block">
          Richieste Speciali
        </Label>
        <Textarea
          id="specialRequests"
          rows={3}
          value={bookingData.specialRequests}
          onChange={(e) => handleGuestInfoChange("specialRequests", e.target.value)}
          placeholder="Transfer aeroporto, culla, allergie alimentari, occasioni speciali..."
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Servizi Inclusi</h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div>• WiFi gratuito ad alta velocità</div>
          <div>• Climatizzatore in ogni ambiente</div>
          <div>• Macchina del caffè premium</div>
          <div>• Sconto 10% noleggio auto</div>
          <div>• Supermercato dietro casa</div>
          <div>• Farmacia a 50 metri</div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => {
    const selectedProperty = properties.find((p) => p.id === bookingData.selectedProperty)
    const nights = Math.ceil(
      (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
    )

    const basePrice = selectedProperty?.id === "lucas-suite" ? 95 : 120
    const cleaningFee = selectedProperty?.cleaningFee || 25
    const petSupplement =
      bookingData.hasPets && selectedProperty?.petsAllowed ? selectedProperty?.petSupplement || 0 : 0
    const totalPrice = basePrice * nights + cleaningFee + petSupplement

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h3 className="text-2xl font-bold text-gray-900">Conferma la Tua Prenotazione</h3>
          </div>
          <p className="text-gray-600">Verifica tutti i dettagli prima di confermare</p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-4 text-lg">📋 Riepilogo Completo</h4>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-amber-800 mb-2">🏨 Struttura</h5>
              <p className="text-amber-700 font-medium">{bookingData.propertyName}</p>
              <p className="text-sm text-amber-600">{selectedProperty?.subtitle}</p>
            </div>

            <div>
              <h5 className="font-semibold text-amber-800 mb-2">📅 Date</h5>
              <p className="text-amber-700">
                {new Date(bookingData.checkIn).toLocaleDateString("it-IT")} -{" "}
                {new Date(bookingData.checkOut).toLocaleDateString("it-IT")}
              </p>
              <p className="text-sm text-amber-600">
                {nights} notti • {bookingData.guests} ospiti
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-amber-800 mb-2">👤 Ospite</h5>
              <p className="text-amber-700">
                {bookingData.guestName} {bookingData.guestSurname}
              </p>
              <p className="text-sm text-amber-600">{bookingData.guestPhone}</p>
              <p className="text-sm text-amber-600">{bookingData.guestEmail}</p>
            </div>

            <div>
              <h5 className="font-semibold text-amber-800 mb-2">💰 Prezzo Stimato</h5>
              <p className="text-amber-700 font-bold text-lg">
                {selectedProperty?.price} × {nights} notti
              </p>
              <p className="text-sm text-amber-600">Prezzo finale da confermare</p>
            </div>
          </div>

          {bookingData.specialRequests && (
            <div className="mt-4">
              <h5 className="font-semibold text-amber-800 mb-2">💬 Richieste Speciali</h5>
              <p className="text-amber-700">{bookingData.specialRequests}</p>
            </div>
          )}
        </div>

        <div>
          <h5 className="font-semibold text-amber-800 mb-2">💰 Dettaglio Prezzo</h5>
          <div className="space-y-1 text-amber-700">
            <p>
              {selectedProperty?.price} × {nights} notti = €{basePrice * nights}
            </p>
            <p>Pulizie finali: €{cleaningFee}</p>
            {bookingData.hasPets && selectedProperty?.petsAllowed && (
              <p>Supplemento animale domestico: €{petSupplement}</p>
            )}
            <div className="border-t border-amber-300 pt-1 mt-2">
              <p className="font-bold text-lg">Totale: €{totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">✅ Prossimi Passi</h4>
          <div className="space-y-1 text-sm text-green-800">
            <p>1. Conferma la prenotazione cliccando il pulsante qui sotto</p>
            <p>2. Riceverai conferma immediata via WhatsApp</p>
            <p>3. Ti contatteremo per finalizzare i dettagli</p>
            <p>4. Preparati per un soggiorno indimenticabile! 🌟</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                Prenotazione Guidata
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Passo {currentStep} di {totalSteps} - Ti guidiamo verso il soggiorno perfetto
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {renderProgressBar()}

          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </Button>

            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2) ||
                    (currentStep === 3 && !canProceedStep3)
                  }
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 flex items-center gap-2"
                >
                  Continua
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinalSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Conferma Prenotazione
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
