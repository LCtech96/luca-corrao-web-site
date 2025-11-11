"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

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

    // Carica tutte le immagini in batch
    const newImages: UploadedImage[] = []
    
    for (const file of filesToUpload) {
      // Crea preview locale
      const preview = URL.createObjectURL(file)
      console.log(`📸 Created preview for: ${file.name}`)
      
      // Per ora usa URL temporaneo (in produzione sarebbe Supabase Storage)
      const fakeUrl = preview
      
      const newImage: UploadedImage = {
        url: fakeUrl,
        file,
        preview
      }
      
      newImages.push(newImage)
      
      // Chiama callback per ogni immagine
      onImageUploaded(fakeUrl)
    }
    
    setUploadedImages(prev => [...prev, ...newImages])
    console.log(`✅ ${newImages.length} images uploaded successfully`)
    setIsUploading(false)
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
        onClick={(e) => {
          e.preventDefault()
          console.log(`🖱️ Upload area clicked, category: ${category}`)
          const input = document.getElementById(`file-input-${category}`)
          console.log('📂 Input element:', input)
          input?.click()
        }}
      >
        <input
          id={`file-input-${category}`}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => {
            console.log(`📂 File input changed, files: ${e.target.files?.length || 0}`)
            handleFileSelect(e.target.files)
          }}
          className="hidden"
        />
        
        <Upload className={cn(
          "w-10 h-10 mx-auto mb-3 transition-all",
          isDragging ? "text-cyan-500 scale-110 animate-bounce" : "text-gray-400 dark:text-gray-500"
        )} />
        <p className={cn(
          "text-sm font-medium mb-1",
          isDragging ? "text-cyan-600 dark:text-cyan-400 font-bold" : "text-gray-700 dark:text-gray-300"
        )}>
          {isDragging ? "🎯 Rilascia qui!" : isUploading ? "⏳ Caricamento..." : "📤 Carica immagini"}
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
