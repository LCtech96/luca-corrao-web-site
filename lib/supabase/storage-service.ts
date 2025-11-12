import { createClient } from './client'

export interface UploadResult {
  url: string
  path: string
  fileId: string
}

/**
 * Upload an image to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name
 * @param folder - Folder path (e.g., user ID)
 * @returns Upload result with permanent URL
 */
export async function uploadImageToStorage(
  file: File,
  bucket: string = 'structures-images',
  folder?: string
): Promise<UploadResult> {
  const supabase = createClient()
  
  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = file.name.split('.').pop()
  const fileName = `${timestamp}-${randomString}.${fileExtension}`
  
  // Build path: folder/filename (or just filename if no folder)
  const filePath = folder ? `${folder}/${fileName}` : fileName
  
  console.log('📤 Uploading to storage:', { bucket, filePath, size: file.size })
  
  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('❌ Storage upload error:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }
  
  console.log('✅ Upload successful:', data.path)
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)
  
  console.log('✅ Public URL:', publicUrl)
  
  return {
    url: publicUrl,
    path: data.path,
    fileId: data.id || data.path
  }
}

/**
 * Delete an image from Supabase Storage
 * @param path - File path in storage
 * @param bucket - Storage bucket name
 */
export async function deleteImageFromStorage(
  path: string,
  bucket: string = 'structures-images'
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    console.error('Error deleting file:', error)
    return false
  }
  
  return true
}

/**
 * Upload multiple images to Supabase Storage
 * @param files - Array of files to upload
 * @param bucket - Storage bucket name
 * @param folder - Folder path
 * @returns Array of upload results
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: string = 'structures-images',
  folder?: string
): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  
  for (const file of files) {
    try {
      const result = await uploadImageToStorage(file, bucket, folder)
      results.push(result)
    } catch (error) {
      console.error('Failed to upload file:', file.name, error)
      // Continue with other files even if one fails
    }
  }
  
  return results
}

