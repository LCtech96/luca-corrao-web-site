"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react"

interface BookingData {
  id: string
  propertyId: string
  propertyName: string
  guestName: string
  guestSurname: string
  guestPhone: string
  guestEmail: string
  numberOfGuests: number
  checkIn: string
  checkOut: string
  specialRequests: string
  status: "confirmed"
  createdAt: Date
}

interface BookingSystemProps {
  propertyId: string
  propertyName: string
  onClose: () => void
}

// Pre-existing bookings for 2025
const getDefaultBookings = (): BookingData[] => [
  // Lucas Suite bookings
  {
    id: "default-1",
    propertyId: "lucas-suite",
    propertyName: "Lucas Suite",
    guestName: "Prenotazione",
    guestSurname: "Esistente",
    guestPhone: "+39 000 000 0000",
    guestEmail: "existing@booking.com",
    numberOfGuests: 2,
    checkIn: "2025-07-24",
    checkOut: "2025-07-27",
    specialRequests: "",
    status: "confirmed",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "default-2",
    propertyId: "lucas-suite",
    propertyName: "Lucas Suite",
    guestName: "Prenotazione",
    guestSurname: "Esistente",
    guestPhone: "+39 000 000 0000",
    guestEmail: "existing@booking.com",
    numberOfGuests: 2,
    checkIn: "2025-08-13",
    checkOut: "2025-08-18",
    specialRequests: "",
    status: "confirmed",
    createdAt: new Date("2024-01-01"),
  },
  // Lucas Rooftop bookings
  {
    id: "default-3",
    propertyId: "lucas-rooftop",
    propertyName: "Lucas Rooftop",
    guestName: "Prenotazione",
    guestSurname: "Esistente",
    guestPhone: "+39 000 000 0000",
    guestEmail: "existing@booking.com",
    numberOfGuests: 4,
    checkIn: "2025-07-24",
    checkOut: "2025-07-28",
    specialRequests: "",
    status: "confirmed",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "default-4",
    propertyId: "lucas-rooftop",
    propertyName: "Lucas Rooftop",
    guestName: "Prenotazione",
    guestSurname: "Esistente",
    guestPhone: "+39 000 000 0000",
    guestEmail: "existing@booking.com",
    numberOfGuests: 4,
    checkIn: "2025-08-14",
    checkOut: "2025-08-19",
    specialRequests: "",
    status: "confirmed",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "default-5",
    propertyId: "lucas-rooftop",
    propertyName: "Lucas Rooftop",
    guestName: "Prenotazione",
    guestSurname: "Esistente",
    guestPhone: "+39 000 000 0000",
    guestEmail: "existing@booking.com",
    numberOfGuests: 4,
    checkIn: "2025-08-22",
    checkOut: "2025-08-25",
    specialRequests: "",
    status: "confirmed",
    createdAt: new Date("2024-01-01"),
  },
]

// Simulated database - in a real app this would be a proper database
const getStoredBookings = (): BookingData[] => {
  if (typeof window === "undefined") return getDefaultBookings()

  const stored = localStorage.getItem("lucasBookings")
  if (!stored) {
    // First time loading, save default bookings
    const defaultBookings = getDefaultBookings()
    localStorage.setItem("lucasBookings", JSON.stringify(defaultBookings))
    return defaultBookings
  }

  const existingBookings = JSON.parse(stored)

  // Check if default bookings are already present
  const hasDefaultBookings = existingBookings.some((booking: BookingData) => booking.id.startsWith("default-"))

  if (!hasDefaultBookings) {
    // Merge existing bookings with default ones
    const mergedBookings = [...getDefaultBookings(), ...existingBookings]
    localStorage.setItem("lucasBookings", JSON.stringify(mergedBookings))
    return mergedBookings
  }

  return existingBookings
}

const saveBookings = (bookings: BookingData[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("lucasBookings", JSON.stringify(bookings))
}

export function BookingSystem({ propertyId, propertyName, onClose }: BookingSystemProps) {
  const [currentView, setCurrentView] = useState<"calendar" | "form">("calendar")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState<{ checkIn: string; checkOut: string }>({
    checkIn: "",
    checkOut: "",
  })
  const [bookings, setBookings] = useState<BookingData[]>([])

  const [bookingForm, setBookingForm] = useState({
    guestName: "",
    guestSurname: "",
    guestPhone: "",
    guestEmail: "",
    numberOfGuests: 1,
    specialRequests: "",
  })

  useEffect(() => {
    setBookings(getStoredBookings())
  }, [])

  const generateDateRange = (startDate: string, endDate: string): string[] => {
    const dates = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0])
    }
    return dates
  }

  const isDateUnavailable = (date: string): boolean => {
    // Check if date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    if (checkDate < today) return true

    // Check if date is already booked
    return bookings.some((booking) => {
      if (booking.propertyId !== propertyId || booking.status !== "confirmed") return false
      const bookedDates = generateDateRange(booking.checkIn, booking.checkOut)
      return bookedDates.includes(date)
    })
  }

  const handleDateSelect = (date: string) => {
    if (isDateUnavailable(date)) return

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      setSelectedDates({ checkIn: date, checkOut: "" })
    } else if (selectedDates.checkIn && !selectedDates.checkOut) {
      if (new Date(date) > new Date(selectedDates.checkIn)) {
        // Check if any dates in between are unavailable
        const dateRange = generateDateRange(selectedDates.checkIn, date)
        const hasUnavailableDate = dateRange.some((d) => isDateUnavailable(d))

        if (hasUnavailableDate) {
          setSelectedDates({ checkIn: date, checkOut: "" })
        } else {
          setSelectedDates({ ...selectedDates, checkOut: date })
        }
      } else {
        setSelectedDates({ checkIn: date, checkOut: "" })
      }
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newBooking: BookingData = {
      id: Date.now().toString(),
      propertyId,
      propertyName,
      ...bookingForm,
      checkIn: selectedDates.checkIn,
      checkOut: selectedDates.checkOut,
      status: "confirmed",
      createdAt: new Date(),
    }

    const updatedBookings = [...bookings, newBooking]
    setBookings(updatedBookings)
    saveBookings(updatedBookings)

    // Send WhatsApp notification
    const message = `🏠 NUOVA PRENOTAZIONE CONFERMATA - ${propertyName}

👤 Nome: ${bookingForm.guestName} ${bookingForm.guestSurname}
📞 Telefono: ${bookingForm.guestPhone}
📧 Email: ${bookingForm.guestEmail}
👥 Ospiti: ${bookingForm.numberOfGuests}
📅 Check-in: ${selectedDates.checkIn}
📅 Check-out: ${selectedDates.checkOut}
💬 Richieste speciali: ${bookingForm.specialRequests || "Nessuna"}

✅ Prenotazione automaticamente confermata!`

    // Send to both WhatsApp numbers
    const whatsappUrl1 = `https://wa.me/+393514206353?text=${encodeURIComponent(message)}`
    const whatsappUrl2 = `https://wa.me/+393513671340?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl1, "_blank")
    setTimeout(() => window.open(whatsappUrl2, "_blank"), 1000)

    alert("Prenotazione confermata! Riceverai una conferma via WhatsApp.")
    onClose()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

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
      const isUnavailable = isDateUnavailable(date)
      const isSelected = date === selectedDates.checkIn || date === selectedDates.checkOut
      const isInRange =
        selectedDates.checkIn &&
        selectedDates.checkOut &&
        new Date(date) > new Date(selectedDates.checkIn) &&
        new Date(date) < new Date(selectedDates.checkOut)

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={isUnavailable}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
            isUnavailable
              ? "bg-red-100 text-red-400 cursor-not-allowed"
              : isSelected
                ? "bg-amber-600 text-white"
                : isInRange
                  ? "bg-amber-100 text-amber-800"
                  : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          {day}
        </button>,
      )
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {monthNames[month]} {year}
          </h3>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
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
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900">Prenota {propertyName}</CardTitle>
              <p className="text-gray-600 mt-2">Seleziona le date per il tuo soggiorno</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {currentView === "calendar" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {renderCalendar()}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded"></div>
                    <span className="text-sm text-gray-600">Non disponibile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-600 rounded"></div>
                    <span className="text-sm text-gray-600">Selezionato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-100 rounded"></div>
                    <span className="text-sm text-gray-600">Periodo selezionato</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                  <h4 className="font-semibold text-amber-900 mb-2">Date Selezionate</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">Check-in: {selectedDates.checkIn || "Seleziona data"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">Check-out: {selectedDates.checkOut || "Seleziona data"}</span>
                    </div>
                    {selectedDates.checkIn && selectedDates.checkOut && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 font-medium">
                          ✅ Periodo disponibile! Durata soggiorno:{" "}
                          {Math.ceil(
                            (new Date(selectedDates.checkOut).getTime() - new Date(selectedDates.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          {Math.ceil(
                            (new Date(selectedDates.checkOut).getTime() - new Date(selectedDates.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24),
                          ) === 1
                            ? "notte"
                            : "notti"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDates.checkIn && selectedDates.checkOut && (
                  <Button onClick={() => setCurrentView("form")} className="w-full bg-amber-600 hover:bg-amber-700">
                    Continua con la Prenotazione
                  </Button>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Informazioni Prenotazione</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Prenotazione immediata senza attesa</li>
                    <li>• Conferma automatica via WhatsApp</li>
                    <li>• Cancellazione gratuita fino a 24h prima</li>
                    <li>• Check-in dalle 15:00, Check-out entro le 11:00</li>
                  </ul>
                </div>

                {/* Show existing bookings info for current property */}
                {bookings.filter((b) => b.propertyId === propertyId && b.id.startsWith("default-")).length > 0 && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">📅 Periodi già Prenotati</h4>
                    <div className="space-y-1 text-sm text-orange-800">
                      {bookings
                        .filter((b) => b.propertyId === propertyId && b.id.startsWith("default-"))
                        .map((booking) => (
                          <div key={booking.id}>
                            • {new Date(booking.checkIn).toLocaleDateString("it-IT")} -{" "}
                            {new Date(booking.checkOut).toLocaleDateString("it-IT")}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === "form" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-2">Riepilogo Prenotazione</h4>
                <div className="space-y-1 text-sm text-amber-800">
                  <p>📍 Struttura: {propertyName}</p>
                  <p>📅 Check-in: {selectedDates.checkIn}</p>
                  <p>📅 Check-out: {selectedDates.checkOut}</p>
                  <p>
                    🌙 Durata:{" "}
                    {Math.ceil(
                      (new Date(selectedDates.checkOut).getTime() - new Date(selectedDates.checkIn).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    {Math.ceil(
                      (new Date(selectedDates.checkOut).getTime() - new Date(selectedDates.checkIn).getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) === 1
                      ? "notte"
                      : "notti"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestName" className="text-sm font-medium text-gray-700">
                      Nome *
                    </Label>
                    <Input
                      id="guestName"
                      required
                      value={bookingForm.guestName}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                      placeholder="Il tuo nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestSurname" className="text-sm font-medium text-gray-700">
                      Cognome *
                    </Label>
                    <Input
                      id="guestSurname"
                      required
                      value={bookingForm.guestSurname}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestSurname: e.target.value })}
                      placeholder="Il tuo cognome"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guestPhone" className="text-sm font-medium text-gray-700">
                      Telefono *
                    </Label>
                    <Input
                      id="guestPhone"
                      required
                      value={bookingForm.guestPhone}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestPhone: e.target.value })}
                      placeholder="+39 123 456 7890"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      required
                      value={bookingForm.guestEmail}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestEmail: e.target.value })}
                      placeholder="tua@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="numberOfGuests" className="text-sm font-medium text-gray-700">
                    Numero di Ospiti *
                  </Label>
                  <Input
                    id="numberOfGuests"
                    type="number"
                    min="1"
                    max={propertyId === "lucas-suite" ? "2" : "5"}
                    required
                    value={bookingForm.numberOfGuests}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, numberOfGuests: Number.parseInt(e.target.value) })
                    }
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Massimo {propertyId === "lucas-suite" ? "2" : "5"} ospiti per questa struttura
                  </p>
                </div>

                <div>
                  <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700">
                    Richieste Speciali
                  </Label>
                  <Textarea
                    id="specialRequests"
                    rows={3}
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                    placeholder="Eventuali richieste particolari (transfer aeroporto, culla, allergie alimentari...)"
                    className="mt-1"
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Prenotazione Immediata</h4>
                  <p className="text-sm text-green-700">
                    La tua prenotazione sarà confermata immediatamente. Riceverai tutti i dettagli via WhatsApp.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                    Conferma Prenotazione
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCurrentView("calendar")}>
                    Indietro
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
