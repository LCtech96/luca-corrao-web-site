"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { uploadImageToStorage } from "@/lib/supabase/storage-service"
import { useAuth } from "@/hooks/use-auth"

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  category?: string
  ownerId?: string
  className?: string
  maxFiles?: number
  accept?: string
}

interface UploadedImage {
  url: string
  file?: File
  preview: string
}

export function ImageUpload({
  onImageUploaded,
  category = "general",
  ownerId,
  className,
  maxFiles = 20,
  accept = "image/*",
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  // Event listener diretto per onChange (più robusto)
  useEffect(() => {
    const input = inputRef.current
    if (!input) {
      console.error(`❌ Input ref is null for category: ${category}`)
      return
    }

    console.log(`✅ Attaching event listener to:`, input)
    console.log(`   - ID: ${input.id}`)
    console.log(`   - Type: ${input.type}`)
    console.log(`   - Multiple: ${input.multiple}`)
    console.log(`   - Accept: ${input.accept}`)

    const handleChange = (e: Event) => {
      console.log(`🔔 CHANGE EVENT FIRED! Event:`, e)
      const target = e.target as HTMLInputElement
      console.log(`📂 File input CHANGED (direct listener), files: ${target.files?.length || 0}`)
      
      if (target.files && target.files.length > 0) {
        console.log(`📋 File details:`)
        for (let i = 0; i < target.files.length; i++) {
          console.log(`   ${i+1}. ${target.files[i].name} (${target.files[i].size} bytes)`)
        }
        handleFileSelect(target.files)
      } else {
        console.warn(`⚠️ Change event fired but no files selected`)
      }
    }

    input.addEventListener('change', handleChange, { capture: false })
    console.log(`✅ Event listener attached to input: file-input-${category}`)

    // Test se l'input è funzionante
    console.log(`🧪 Input status:`)
    console.log(`   - Disabled: ${input.disabled}`)
    console.log(`   - ReadOnly: ${input.readOnly}`)
    console.log(`   - Hidden: ${input.offsetParent === null}`)

    return () => {
      input.removeEventListener('change', handleChange)
      console.log(`🗑️ Event listener removed from: file-input-${category}`)
    }
  }, [category])

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log('❌ No files selected')
      return
    }
    
    console.log(`📁 Files selected: ${files.length}`)
    
    const remainingSlots = maxFiles - uploadedImages.length
    if (remainingSlots <= 0) {
      alert(`Puoi caricare massimo ${maxFiles} immagini`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    console.log(`📤 Uploading ${filesToUpload.length} files (${remainingSlots} slots available)`)
    
    setIsUploading(true)
    setUploadProgress(0)

    // Carica tutte le immagini su Supabase Storage
    const newImages: UploadedImage[] = []
    const folder = user?.id || ownerId || 'anonymous'
    
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i]
      setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100))
      
      try {
        console.log(`📤 Uploading ${i+1}/${filesToUpload.length}: ${file.name}`)
        
        // Upload to Supabase Storage
        const result = await uploadImageToStorage(file, 'structures-images', folder)
        
        console.log(`✅ Uploaded to Storage: ${result.url}`)
        
        // Crea preview locale per UI immediata
        const preview = URL.createObjectURL(file)
        
        const newImage: UploadedImage = {
          url: result.url, // URL permanente da Supabase Storage
          file,
          preview // Preview locale per UI
        }
        
        newImages.push(newImage)
        
        // Chiama callback con URL permanente
        onImageUploaded(result.url)
        
        console.log(`📸 ${category} image uploaded: ${result.url}`)
      } catch (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error)
        // Continua con le altre immagini anche se una fallisce
      }
    }
    
    setUploadedImages(prev => [...prev, ...newImages])
    console.log(`✅ ${newImages.length} images uploaded successfully`)
    setIsUploading(false)
    setUploadProgress(0)
  }

  const removeImage = (index: number) => {
    const imageToRemove = uploadedImages[index]
    URL.revokeObjectURL(imageToRemove.preview)
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    console.log('🎯 Drop event triggered, files:', e.dataTransfer.files.length)
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const visiblePreviews = uploadedImages.slice(0, 4)
  const remainingCount = uploadedImages.length - 4

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('🎯 Drag enter')
          setIsDragging(true)
        }}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer select-none",
          isDragging
            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 scale-[1.02]"
            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-cyan-400 dark:hover:border-cyan-500"
        )}
      >
        {/* Input visibile ma trasparente - FIX per iPhone emulation */}
        <input
          ref={inputRef}
          id={`file-input-${category}`}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          disabled={isUploading}
          onChange={(e) => {
            console.log(`🔔 CHANGE (React onChange), files: ${e.target.files?.length}`)
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelect(e.target.files)
            }
          }}
          className={cn(
            "absolute inset-0 w-full h-full opacity-0 z-10",
            isUploading ? "cursor-not-allowed" : "cursor-pointer"
          )}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: isUploading ? 'not-allowed' : 'pointer',
            zIndex: 10
          }}
        />
        
        {isUploading ? (
          <>
            <Loader2 className="w-10 h-10 mx-auto mb-3 text-cyan-500 animate-spin" />
            <p className="text-sm font-medium mb-1 text-cyan-600 dark:text-cyan-400">
              ⏳ Caricamento su Supabase Storage...
            </p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {uploadProgress}% completato
            </p>
          </>
        ) : (
          <>
            <Upload className={cn(
              "w-10 h-10 mx-auto mb-3 transition-all",
              isDragging ? "text-cyan-500 scale-110 animate-bounce" : "text-gray-400 dark:text-gray-500"
            )} />
            <p className={cn(
              "text-sm font-medium mb-1",
              isDragging ? "text-cyan-600 dark:text-cyan-400 font-bold" : "text-gray-700 dark:text-gray-300"
            )}>
              {isDragging ? "🎯 Rilascia qui!" : "📤 Carica immagini"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isDragging ? "Rilascia per caricare" : "Trascina qui o clicca per selezionare (max "+maxFiles+")"}
            </p>
            <p className={cn(
              "text-xs mt-2 font-medium",
              uploadedImages.length > 0 ? "text-cyan-600 dark:text-cyan-400" : "text-gray-400"
            )}>
              {uploadedImages.length}/{maxFiles} immagini caricate
            </p>
          </>
        )}
      </div>

      {/* Preview Prime 4 Immagini */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {uploadedImages.length === 1 ? "Anteprima immagine:" : `Anteprime (prime 4 di ${uploadedImages.length}):`}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {visiblePreviews.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge numero */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  #{index + 1}
                </div>

                {/* Bottone rimuovi */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Badge "Altre X" */}
          {remainingCount > 0 && (
            <div className="flex items-center justify-center gap-2 py-2 px-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
              <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">
                + altre {remainingCount} {remainingCount === 1 ? 'immagine' : 'immagini'}
              </p>
            </div>
          )}

          {/* Bottone rimuovi tutte */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              uploadedImages.forEach(img => URL.revokeObjectURL(img.preview))
              setUploadedImages([])
            }}
            className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
          >
            Rimuovi tutte ({uploadedImages.length})
          </Button>
        </div>
      )}
    </div>
  )
}
