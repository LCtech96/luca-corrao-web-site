import { createClient } from './client'
import type { Database } from './types'

export type Accommodation = Database['public']['Tables']['accommodations']['Row']
export type AccommodationInsert = Database['public']['Tables']['accommodations']['Insert']
export type AccommodationUpdate = Database['public']['Tables']['accommodations']['Update']

// Get all active accommodations
export async function getAllAccommodations() {
  try {
    const supabase = createClient()
    
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase environment variables not configured. Returning empty array.')
      return []
    }
    
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching accommodations:', error)
      // Log more details about the error
      if (error.message) {
        console.error('Error message:', error.message)
      }
      if (error.details) {
        console.error('Error details:', error.details)
      }
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getAllAccommodations:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return []
  }
}

// Get accommodations by owner
export async function getAccommodationsByOwner(owner: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('owner', owner)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching accommodations by owner:', error)
    return []
  }
  
  return data || []
}

// Get a single accommodation by ID
export async function getAccommodationById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching accommodation:', error)
    return null
  }
  
  return data
}

// Create a new accommodation
export async function createAccommodation(accommodation: AccommodationInsert) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('accommodations')
    .insert({
      ...accommodation,
      is_active: true,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating accommodation:', error)
    throw error
  }
  
  return data
}

// Update an existing accommodation
export async function updateAccommodation(id: string, updates: AccommodationUpdate) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('accommodations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating accommodation:', error)
    throw error
  }
  
  return data
}

// Soft delete an accommodation (set is_active to false)
export async function deleteAccommodation(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('accommodations')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting accommodation:', error)
    throw error
  }
  
  return { success: true }
}

// Permanently delete an accommodation
export async function deleteAccommodationHard(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('accommodations')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error permanently deleting accommodation:', error)
    throw error
  }
  
  return { success: true }
}

// Search accommodations by name, description, or features
export async function searchAccommodations(searchTerm: string, limit: number = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .limit(limit)
  
  if (error) {
    console.error('Error searching accommodations:', error)
    return []
  }
  
  return data || []
}

// Subscribe to accommodations changes (real-time)
export function subscribeToAccommodations(callback: (accommodations: Accommodation[]) => void) {
  const supabase = createClient()
  
  const channel = supabase
    .channel('accommodations-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'accommodations',
      },
      async () => {
        // Refetch all accommodations when changes occur
        const accommodations = await getAllAccommodations()
        callback(accommodations)
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}
