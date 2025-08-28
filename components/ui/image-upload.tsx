"use client"

import React, { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface UploadedFile {
  fileId: string
  storageId: string
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

interface ImageUploadProps {
  onUpload?: (files: UploadedFile[]) => void
  onRemove?: (fileId: string) => void
  maxFiles?: number
  category?: string
  uploadedBy?: string
  accept?: string
  maxSize?: number // in MB
  disabled?: boolean
  className?: string
  showPreview?: boolean
  showMetadata?: boolean
  multiple?: boolean
}

export function ImageUpload({
  onUpload,
  onRemove,
  maxFiles = 10,
  category = 'general',
  uploadedBy,
  accept = 'image/*',
  maxSize = 10,
  disabled = false,
  className,
  showPreview = true,
  showMetadata = false,
  multiple = true,
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return

    // Check file limit
    const remainingSlots = maxFiles - uploadedFiles.length
    const filesToUpload = multiple ? files.slice(0, remainingSlots) : [files[0]]

    if (filesToUpload.length === 0) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Client-side validation
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)
        formData.append('uploadedBy', uploadedBy || '')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        return await response.json()
      })

      const results = await Promise.all(uploadPromises)
      const newFiles: UploadedFile[] = results.filter(result => result.success)

      setUploadedFiles(prev => [...prev, ...newFiles])
      onUpload?.(newFiles)

    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }, [maxFiles, uploadedFiles.length, multiple, maxSize, category, uploadedBy, onUpload])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [disabled, handleFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled || !e.target.files) return

    const files = Array.from(e.target.files)
    handleFiles(files)
  }, [disabled, handleFiles])

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.fileId !== fileId))
    onRemove?.(fileId)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const openFileDialog = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {accept} up to {maxSize}MB each
                  {multiple && `, max ${maxFiles} files`}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedFiles.map((file) => (
            <Card key={file.fileId} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={file.url}
                    alt={file.fileName}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.fileId)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {showMetadata && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium truncate" title={file.fileName}>
                      {file.fileName}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {file.fileType.split('/')[1].toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* File List (alternative to preview) */}
      {!showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div key={file.fileId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ImageIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{file.fileName}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.fileId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}