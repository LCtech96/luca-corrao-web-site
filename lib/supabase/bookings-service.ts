import { createClient } from './client'

export interface Booking {
  id: string
  property_id: string
  property_name: string
  property_slug: string
  guest_email: string
  guest_name: string
  guest_phone: string
  check_in: string
  check_out: string
  guests: number
  nights: number
  price_per_night: number
  cleaning_fee: number
  subtotal: number
  total: number
  payment_method: string | null
  payment_status: string
  payment_date: string | null
  notes: string | null
  status: string
  property_owner_email: string
  created_at: string
  updated_at: string
}

export interface BookingInsert {
  property_id?: string
  property_name: string
  property_slug: string
  guest_email: string
  guest_name: string
  guest_phone: string
  check_in: string
  check_out: string
  guests: number
  nights: number
  price_per_night: number
  cleaning_fee?: number
  subtotal: number
  total: number
  payment_method?: string | null
  notes?: string | null
  property_owner_email: string
}

export interface ChatMessage {
  id: string
  booking_id: string
  sender_email: string
  sender_name: string
  sender_type: 'guest' | 'host' | 'admin'
  message: string
  is_read: boolean
  created_at: string
}

// Create a new booking
export async function createBooking(booking: BookingInsert): Promise<Booking | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating booking:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in createBooking:', error)
    return null
  }
}

// Get user's bookings (only their own)
export async function getMyBookings(userEmail: string): Promise<Booking[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('guest_email', userEmail)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getMyBookings:', error)
    return []
  }
}

// Get single booking (with RLS check)
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()
    
    if (error) {
      console.error('Error fetching booking:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getBookingById:', error)
    return null
  }
}

// Send a chat message
export async function sendChatMessage(
  bookingId: string,
  senderEmail: string,
  senderName: string,
  senderType: 'guest' | 'host' | 'admin',
  message: string
): Promise<ChatMessage | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        booking_id: bookingId,
        sender_email: senderEmail,
        sender_name: senderName,
        sender_type: senderType,
        message: message,
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Error sending message:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in sendChatMessage:', error)
    return null
  }
}

// Get chat messages for a booking (RLS enforced)
export async function getChatMessages(bookingId: string): Promise<ChatMessage[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching chat messages:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getChatMessages:', error)
    return []
  }
}

// Subscribe to new chat messages
export function subscribeToChatMessages(
  bookingId: string,
  callback: (message: ChatMessage) => void
) {
  const supabase = createClient()
  
  const channel = supabase
    .channel(`chat_${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `booking_id=eq.${bookingId}`,
      },
      (payload) => {
        callback(payload.new as ChatMessage)
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}

// Mark message as read
export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('id', messageId)
    
    if (error) {
      console.error('Error marking message as read:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error in markMessageAsRead:', error)
    return false
  }
}

// ADMIN ONLY: Get all bookings (RLS permette solo a Luca)
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all bookings:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getAllBookings:', error)
    return []
  }
}

// ADMIN ONLY: Get all chat messages across all bookings
export async function getAllChatMessages(): Promise<ChatMessage[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all messages:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getAllChatMessages:', error)
    return []
  }
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: string
): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
    
    if (error) {
      console.error('Error updating booking status:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error in updateBookingStatus:', error)
    return false
  }
}

// Update payment status
export async function updatePaymentStatus(
  bookingId: string,
  paymentStatus: string,
  paymentMethod?: string
): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const updates: any = { 
      payment_status: paymentStatus,
      payment_date: paymentStatus === 'paid' ? new Date().toISOString() : null
    }
    
    if (paymentMethod) {
      updates.payment_method = paymentMethod
    }
    
    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
    
    if (error) {
      console.error('Error updating payment status:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error)
    return false
  }
}

