import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface Structure {
  id: string
  name: string
  description: string
  address: string
  gpsCoordinates?: string
  rating: number
  mainImage: string
  images: string[]
  mainImageFileId?: string
  imageFileIds?: string[]
  owner: string
  ownerEmail: string
  ownerId: string
  isActive: boolean
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

// Get all structures (admin can see all, users see only approved)
export async function getAllStructures(supabaseClient?: SupabaseClient): Promise<Structure[]> {
  const supabase = supabaseClient || createClient()
  
  const { data, error } = await supabase
    .from('structures')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching structures:', error)
    return []
  }

  return (data || []).map(formatStructure)
}

// Get user's own structures
export async function getUserStructures(userId: string, supabaseClient?: SupabaseClient): Promise<Structure[]> {
  const supabase = supabaseClient || createClient()
  
  const { data, error } = await supabase
    .from('structures')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user structures:', error)
    return []
  }

  return (data || []).map(formatStructure)
}

// Add new structure
export async function addStructure(
  structure: Omit<Structure, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'status'>,
  supabaseClient?: SupabaseClient
): Promise<Structure | null> {
  console.log('🔷 addStructure called with:', {
    name: structure.name,
    owner: structure.owner,
    ownerId: structure.ownerId,
    hasSupabaseClient: !!supabaseClient
  })
  
  const supabase = supabaseClient || createClient()
  
  console.log('🔷 Supabase client:', supabaseClient ? 'Server client (authenticated)' : 'Default client')
  
  const insertData = {
    name: structure.name,
    description: structure.description,
    address: structure.address,
    gps_coordinates: structure.gpsCoordinates || null,
    rating: structure.rating,
    main_image: structure.mainImage,
    images: structure.images,
    main_image_file_id: structure.mainImageFileId || null,
    image_file_ids: structure.imageFileIds || null,
    owner: structure.owner,
    owner_email: structure.ownerEmail,
    owner_id: structure.ownerId,
    is_active: false, // Pending approval
    status: 'pending'
  }
  
  console.log('🔷 Insert data prepared:', insertData)
  
  const { data, error } = await supabase
    .from('structures')
    .insert([insertData])
    .select()
    .single()

  console.log('🔷 Insert result - data:', data, 'error:', error)

  if (error) {
    console.error('❌ Error adding structure:', error)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error details:', error.details)
    console.error('❌ Error hint:', error.hint)
    console.error('❌ Error message:', error.message)
    throw error
  }

  console.log('✅ Structure added successfully:', data?.id)
  return data ? formatStructure(data) : null
}

// Update structure (owner or admin)
export async function updateStructure(id: string, updates: Partial<Structure>, supabaseClient?: SupabaseClient): Promise<Structure | null> {
  const supabase = supabaseClient || createClient()
  
  const updateData: any = {}
  if (updates.name) updateData.name = updates.name
  if (updates.description) updateData.description = updates.description
  if (updates.address) updateData.address = updates.address
  if (updates.gpsCoordinates !== undefined) updateData.gps_coordinates = updates.gpsCoordinates
  if (updates.rating !== undefined) updateData.rating = updates.rating
  if (updates.mainImage) updateData.main_image = updates.mainImage
  if (updates.images) updateData.images = updates.images
  if (updates.mainImageFileId !== undefined) updateData.main_image_file_id = updates.mainImageFileId
  if (updates.imageFileIds !== undefined) updateData.image_file_ids = updates.imageFileIds
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive
  if (updates.status) updateData.status = updates.status

  const { data, error } = await supabase
    .from('structures')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating structure:', error)
    throw error
  }

  return data ? formatStructure(data) : null
}

// Delete structure (owner or admin)
export async function deleteStructure(id: string, supabaseClient?: SupabaseClient): Promise<boolean> {
  const supabase = supabaseClient || createClient()
  
  const { error } = await supabase
    .from('structures')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting structure:', error)
    return false
  }

  return true
}

// Approve structure (admin only - check done in API route)
export async function approveStructure(id: string, supabaseClient?: SupabaseClient): Promise<Structure | null> {
  return updateStructure(id, { isActive: true, status: 'approved' }, supabaseClient)
}

// Reject structure (admin only - check done in API route)
export async function rejectStructure(id: string, supabaseClient?: SupabaseClient): Promise<Structure | null> {
  return updateStructure(id, { isActive: false, status: 'rejected' }, supabaseClient)
}

// Format structure from database format to app format
function formatStructure(dbStructure: any): Structure {
  return {
    id: dbStructure.id,
    name: dbStructure.name,
    description: dbStructure.description,
    address: dbStructure.address,
    gpsCoordinates: dbStructure.gps_coordinates || undefined,
    rating: dbStructure.rating,
    mainImage: dbStructure.main_image,
    images: dbStructure.images || [],
    mainImageFileId: dbStructure.main_image_file_id || undefined,
    imageFileIds: dbStructure.image_file_ids || undefined,
    owner: dbStructure.owner,
    ownerEmail: dbStructure.owner_email,
    ownerId: dbStructure.owner_id,
    isActive: dbStructure.is_active,
    status: dbStructure.status,
    createdAt: dbStructure.created_at,
    updatedAt: dbStructure.updated_at
  }
}

// Subscribe to changes (real-time)
export function subscribeToStructures(callback: (structures: Structure[]) => void) {
  const supabase = createClient()
  
  const channel = supabase
    .channel('structures-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'structures' },
      () => {
        // Refetch all structures when any change occurs
        getAllStructures().then(callback)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

