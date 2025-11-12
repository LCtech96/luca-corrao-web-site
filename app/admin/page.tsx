"use client"

import { useEffect, useState } from "react"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { useAuth } from "@/hooks/use-auth"
import { getAllBookings, getAllChatMessages, type Booking, type ChatMessage } from "@/lib/supabase/bookings-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Mail, Phone, MessageCircle, Euro, ChevronLeft, Building2 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !adminLoading && isAdmin) {
      loadData()
    }
  }, [authLoading, adminLoading, isAdmin])

  const loadData = async () => {
    setLoading(true)
    const [bookingsData, messagesData] = await Promise.all([
      getAllBookings(),
      getAllChatMessages(),
    ])
    setBookings(bookingsData)
    setMessages(messagesData)
    setLoading(false)
  }

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Accesso Negato</h1>
          <p className="text-gray-600 mb-6">
            Solo gli amministratori possono accedere a questa pagina.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Email corrente: {user?.email || 'Non autenticato'}
          </p>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getBookingMessages = (bookingId: string) => {
    return messages.filter(msg => msg.booking_id === bookingId)
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-purple-100 text-purple-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-600">Benvenuto, {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/structures">
                <Button variant="outline">
                  <Building2 className="w-4 h-4 mr-2" />
                  Gestisci Strutture
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Gestisci Utenti
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Torna al Sito
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Prenotazioni Totali</h3>
            <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">In Attesa</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Confermate</h3>
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Messaggi Totali</h3>
            <p className="text-3xl font-bold text-blue-600">{messages.length}</p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Tutte le Prenotazioni</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              Nessuna prenotazione ancora
            </div>
          ) : (
            <div className="divide-y">
              {bookings.map((booking) => {
                const bookingMessages = getBookingMessages(booking.id)
                const isExpanded = selectedBooking === booking.id
                
                return (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{booking.property_name}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          {booking.payment_status === 'paid' && (
                            <Badge className="bg-green-100 text-green-800">Pagato</Badge>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{booking.guest_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${booking.guest_email}`} className="hover:underline text-blue-600">
                              {booking.guest_email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${booking.guest_phone}`} className="hover:underline text-blue-600">
                              {booking.guest_phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(booking.check_in).toLocaleDateString('it-IT')} - {new Date(booking.check_out).toLocaleDateString('it-IT')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{booking.guests} ospiti, {booking.nights} notti</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4" />
                            <span className="font-semibold text-amber-600">€{booking.total}</span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                            <strong>Note:</strong> {booking.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(isExpanded ? null : booking.id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {bookingMessages.length} messaggi
                        </Button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    {isExpanded && bookingMessages.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold mb-3">Chat con {booking.guest_name}</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {bookingMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender_type === 'guest' ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  msg.sender_type === 'guest'
                                    ? 'bg-white border'
                                    : 'bg-amber-500 text-white'
                                }`}
                              >
                                <p className="text-xs font-medium mb-1">
                                  {msg.sender_name} ({msg.sender_type})
                                </p>
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(msg.created_at).toLocaleString('it-IT')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 text-xs text-gray-400">
                      Prenotazione creata: {new Date(booking.created_at).toLocaleString('it-IT')}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

