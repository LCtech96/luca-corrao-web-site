// WhatsApp Authentication Service
// Since WhatsApp doesn't have native OAuth, we'll use phone-based authentication
// with Supabase's phone auth + WhatsApp link for verification

import { createClient } from './supabase/client'

export interface WhatsAppAuthRequest {
  phone: string
  fullName: string
}

// Format phone number to international format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '')
  
  // If it starts with 0, remove it and add country code
  if (cleaned.startsWith('0')) {
    cleaned = '39' + cleaned.substring(1) // Default to Italy +39
  }
  
  // If it doesn't start with a country code, add Italy +39
  if (!cleaned.startsWith('39') && cleaned.length === 10) {
    cleaned = '39' + cleaned
  }
  
  return '+' + cleaned
}

// Send OTP via Supabase Phone Auth
export async function sendWhatsAppOTP(phone: string): Promise<boolean> {
  const supabase = createClient()
  const formattedPhone = formatPhoneNumber(phone)
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        // WhatsApp channel if available (Supabase supports this with Twilio)
        channel: 'whatsapp',
      }
    })
    
    if (error) {
      console.error('Error sending WhatsApp OTP:', error)
      // Fallback to SMS if WhatsApp channel not available
      const { error: smsError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      })
      
      if (smsError) throw smsError
    }
    
    return true
  } catch (error) {
    console.error('Error in WhatsApp auth:', error)
    throw error
  }
}

// Verify OTP code
export async function verifyWhatsAppOTP(
  phone: string,
  otp: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const supabase = createClient()
  const formattedPhone = formatPhoneNumber(phone)
  
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: 'sms'
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    if (!data.user) {
      return { success: false, error: 'Verification failed' }
    }
    
    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Generate WhatsApp direct link for contact
export function generateWhatsAppLink(
  phoneNumber: string, 
  message: string
): string {
  const formatted = formatPhoneNumber(phoneNumber).replace('+', '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formatted}?text=${encodedMessage}`
}

// Generate WhatsApp support link for the website
export function generateSupportWhatsAppLink(): string {
  // Luca's WhatsApp number
  const phone = '+393319892611' // Update with actual number
  const message = 'Ciao! Ho bisogno di assistenza per la registrazione.'
  return generateWhatsAppLink(phone, message)
}

// Alternative: Magic link via WhatsApp
// This sends a magic link to the user's WhatsApp instead of OTP
export async function sendWhatsAppMagicLink(
  phone: string,
  fullName: string
): Promise<string> {
  const supabase = createClient()
  const formattedPhone = formatPhoneNumber(phone)
  
  // Generate a magic link token
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone
  })
  
  if (error) throw error
  
  // Get the magic link (in production, this would be sent via WhatsApp API)
  const magicLink = `${window.location.origin}/auth/callback?phone=${encodeURIComponent(formattedPhone)}`
  
  // In a real implementation, you would use WhatsApp Business API to send this
  // For now, we return the link to be sent manually
  return magicLink
}

// Check if WhatsApp Business API is configured
export function isWhatsAppAPIConfigured(): boolean {
  // Check if environment variables for WhatsApp Business API are set
  return !!(
    process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_ID &&
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE_ID
  )
}

// Send message via WhatsApp Business API (requires setup)
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  if (!isWhatsAppAPIConfigured()) {
    console.warn('WhatsApp Business API not configured')
    return false
  }
  
  try {
    // This would call WhatsApp Business API
    // For now, just log
    console.log(`Would send to ${to}: ${message}`)
    return true
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return false
  }
}

// Simple WhatsApp link authentication
// User clicks a WhatsApp link, sends a code, we verify it
export interface WhatsAppLinkAuth {
  code: string
  expiresAt: Date
}

const authCodes = new Map<string, WhatsAppLinkAuth>()

export function generateAuthCode(phone: string): string {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  authCodes.set(phone, {
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  })
  return code
}

export function verifyAuthCode(phone: string, code: string): boolean {
  const stored = authCodes.get(phone)
  if (!stored) return false
  
  if (stored.expiresAt < new Date()) {
    authCodes.delete(phone)
    return false
  }
  
  if (stored.code === code.toUpperCase()) {
    authCodes.delete(phone)
    return true
  }
  
  return false
}

