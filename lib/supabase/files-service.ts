import { createClient } from './client'
import type { Database } from './types'

export type File = Database['public']['Tables']['files']['Row']
export type FileInsert = Database['public']['Tables']['files']['Insert']
export type FileUpdate = Database['public']['Tables']['files']['Update']

const BUCKET_NAME = 'accommodations-images'

// Generate upload URL and upload file
export async function uploadFile(
  file: globalThis.File,
  options?: {
    category?: string
    ownerId?: string
    description?: string
  }
) {
  const supabase = createClient()
  
  // Generate unique file path
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `${options?.category || 'general'}/${fileName}`
  
  // Upload file to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError)
    throw uploadError
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)
  
  // Store file metadata in database
  const { data: fileData, error: dbError } = await supabase
    .from('files')
    .insert({
      storage_id: filePath,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      description: options?.description,
      category: options?.category || 'general',
      owner_id: options?.ownerId,
      is_active: true,
    })
    .select()
    .single()
  
  if (dbError) {
    console.error('Error storing file metadata:', dbError)
    // Try to cleanup uploaded file
    await supabase.storage.from(BUCKET_NAME).remove([filePath])
    throw dbError
  }
  
  return {
    ...fileData,
    url: publicUrl,
  }
}

// Get file URL from storage ID
export async function getFileUrl(storageId: string) {
  const supabase = createClient()
  
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storageId)
  
  return data.publicUrl
}

// Get file metadata by file ID
export async function getFileById(fileId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single()
  
  if (error) {
    console.error('Error fetching file:', error)
    return null
  }
  
  if (data) {
    const url = await getFileUrl(data.storage_id)
    return {
      ...data,
      url,
    }
  }
  
  return null
}

// Get files by category or owner
export async function getFiles(options?: {
  category?: string
  ownerId?: string
  limit?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('files')
    .select('*')
    .eq('is_active', true)
  
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  
  if (options?.ownerId) {
    query = query.eq('owner_id', options.ownerId)
  }
  
  query = query
    .order('uploaded_at', { ascending: false })
    .limit(options?.limit || 50)
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching files:', error)
    return []
  }
  
  // Get URLs for all files
  const filesWithUrls = await Promise.all(
    (data || []).map(async (file) => ({
      ...file,
      url: await getFileUrl(file.storage_id),
    }))
  )
  
  return filesWithUrls
}

// Delete file (soft delete)
export async function deleteFile(fileId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('files')
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq('id', fileId)
  
  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }
  
  return { success: true }
}

// Permanently delete file from storage and database
export async function deleteFileHard(fileId: string) {
  const supabase = createClient()
  
  // Get file metadata
  const { data: file, error: fetchError } = await supabase
    .from('files')
    .select('storage_id')
    .eq('id', fileId)
    .single()
  
  if (fetchError || !file) {
    console.error('Error fetching file for deletion:', fetchError)
    throw fetchError || new Error('File not found')
  }
  
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([file.storage_id])
  
  if (storageError) {
    console.error('Error deleting file from storage:', storageError)
    throw storageError
  }
  
  // Delete from database
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId)
  
  if (dbError) {
    console.error('Error deleting file from database:', dbError)
    throw dbError
  }
  
  return { success: true }
}

// Update file metadata
export async function updateFile(fileId: string, updates: FileUpdate) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('files')
    .update(updates)
    .eq('id', fileId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating file:', error)
    throw error
  }
  
  return data
}

// Get storage usage statistics
export async function getStorageStats(ownerId?: string) {
  try {
    const supabase = createClient()
    
    let query = supabase
      .from('files')
      .select('file_size, category')
      .eq('is_active', true)
    
    if (ownerId) {
      query = query.eq('owner_id', ownerId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching storage stats:', error)
      return {
        totalFiles: 0,
        totalSize: 0,
        totalSizeMB: 0,
        categories: {},
      }
    }
    
    const files = data || []
    const totalFiles = files.length
    const totalSize = files.reduce((sum, file) => sum + (file.file_size || 0), 0)
    const categories = files.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalFiles,
      totalSize,
      totalSizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
      categories,
    }
  } catch (error) {
    console.error('Error in getStorageStats:', error)
    return {
      totalFiles: 0,
      totalSize: 0,
      totalSizeMB: 0,
      categories: {},
    }
  }
}
