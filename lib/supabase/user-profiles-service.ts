import { createClient } from './client'

export type UserRole = 'admin' | 'host' | 'guest'

export interface UserProfile {
  id: string
  user_id: string | null
  email: string | null
  phone: string | null
  full_name: string
  avatar_url: string | null
  role: UserRole
  is_host: boolean
  host_verified: boolean
  host_bio: string | null
  host_languages: string[] | null
  notifications_enabled: boolean
  email_verified: boolean
  phone_verified: boolean
  whatsapp_number: string | null
  whatsapp_verified: boolean
  revolut_username: string | null
  accepts_crypto: boolean
  wallet_address: string | null
  created_at: string
  updated_at: string
  last_login: string | null
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data
}

// Get user profile by email
export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data
}

// Update user profile
export async function updateUserProfile(
  profileId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
  
  return data
}

// Request host status
export async function requestHostStatus(
  bio?: string,
  languages?: string[]
): Promise<boolean> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    throw new Error('User must be logged in')
  }
  
  const { error } = await supabase.rpc('request_host_status', {
    user_email: user.email,
    bio: bio || null,
    languages: languages || null
  })
  
  if (error) {
    console.error('Error requesting host status:', error)
    throw error
  }
  
  return true
}

// Check if user is admin
export function isAdmin(profile: UserProfile | null): boolean {
  if (!profile || !profile.email) return false
  
  const adminEmails = [
    'luca@bedda.tech',
    'lucacorrao96@outlook.it',
    'luca@metatech.dev',
    'lucacorrao1996@outlook.com',
    'luca@lucacorrao.com'
  ]
  
  return adminEmails.includes(profile.email) || profile.role === 'admin'
}

// Check if user is host
export function isHost(profile: UserProfile | null): boolean {
  if (!profile) return false
  return profile.is_host && profile.host_verified
}

// Check if user can create accommodations
export function canCreateAccommodations(profile: UserProfile | null): boolean {
  return isAdmin(profile) || isHost(profile)
}

// Get all user profiles (admin only)
export async function getAllUserProfiles(): Promise<UserProfile[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('admin_all_users')
    .select('*')
  
  if (error) {
    console.error('Error fetching all profiles:', error)
    throw error
  }
  
  return data || []
}

// Admin: Verify host
export async function verifyHost(hostEmail: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    throw new Error('Admin must be logged in')
  }
  
  const { error } = await supabase.rpc('verify_host', {
    host_email: hostEmail,
    admin_email: user.email
  })
  
  if (error) {
    console.error('Error verifying host:', error)
    throw error
  }
  
  return true
}

// Create or update profile for WhatsApp user
export async function createWhatsAppProfile(
  phone: string,
  fullName: string,
  whatsappNumber: string
): Promise<UserProfile> {
  const supabase = createClient()
  
  // Check if profile already exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .single()
  
  if (existing) {
    // Update existing profile
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        whatsapp_number: whatsappNumber,
        whatsapp_verified: true,
        last_login: new Date().toISOString()
      })
      .eq('phone', phone)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  // Create new profile
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      phone,
      full_name: fullName,
      whatsapp_number: whatsappNumber,
      whatsapp_verified: true,
      phone_verified: true,
      role: 'guest',
      last_login: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Get host profiles (public)
export async function getVerifiedHosts(): Promise<UserProfile[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, full_name, avatar_url, host_bio, host_languages, created_at')
    .eq('is_host', true)
    .eq('host_verified', true)
  
  if (error) {
    console.error('Error fetching hosts:', error)
    return []
  }
  
  return data || []
}

// Update last login
export async function updateLastLogin(profileId: string): Promise<void> {
  const supabase = createClient()
  
  await supabase
    .from('user_profiles')
    .update({ last_login: new Date().toISOString() })
    .eq('id', profileId)
}

