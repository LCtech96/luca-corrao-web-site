"use client"

import React, { useState } from 'react'
import { useAuth } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Edit,
  Image as ImageIcon,
  Calendar,
  HardDrive
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import type { Id } from "@/convex/_generated/dataModel"

interface UploadedFile {
  fileId: string
  storageId: string
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

export default function AdminImagesPage() {
  const { userId, isSignedIn } = useAuth()
  const files = useQuery(api.files.getFiles, { limit: 100 })
  const deleteFile = useMutation(api.files.deleteFile)
  const updateFile = useMutation(api.files.updateFile)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accesso Richiesto</h1>
          <p>Devi essere autenticato per accedere al pannello di amministrazione.</p>
        </div>
      </div>
    )
  }

  const handleImageUpload = (uploadedFiles: UploadedFile[]) => {
    toast.success(`${uploadedFiles.length} immagine${uploadedFiles.length > 1 ? 'i' : ''} caricata${uploadedFiles.length > 1 ? 'e' : ''} con successo`)
  }

  const handleDelete = async (fileId: Id<"files">) => {
    if (confirm('Sei sicuro di voler eliminare questa immagine?')) {
      try {
        await deleteFile({ fileId })
        toast.success('Immagine eliminata con successo')
      } catch (error) {
        console.error('Error deleting file:', error)
        toast.error('Errore durante l\'eliminazione')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return
    
    if (confirm(`Sei sicuro di voler eliminare ${selectedFiles.size} immagine${selectedFiles.size > 1 ? 'i' : ''}?`)) {
      try {
        await Promise.all(
          Array.from(selectedFiles).map(fileId => deleteFile({ fileId: fileId as Id<"files"> }))
        )
        setSelectedFiles(new Set())
        toast.success(`${selectedFiles.size} immagine${selectedFiles.size > 1 ? 'i' : ''} eliminate con successo`)
      } catch (error) {
        console.error('Error deleting files:', error)
        toast.error('Errore durante l\'eliminazione')
      }
    }
  }

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId)
    } else {
      newSelection.add(fileId)
    }
    setSelectedFiles(newSelection)
  }

  const filteredFiles = files?.files?.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const categories = ['all', 'accommodation', 'profile', 'general']
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestione Immagini</h1>
          <p className="text-gray-600 mt-1">
            Carica e gestisci tutte le immagini del sito
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Carica Nuove Immagini</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            onUpload={handleImageUpload}
            category="general"
            uploadedBy={userId}
            showPreview={false}
            multiple={true}
            maxFiles={20}
          />
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cerca per nome o descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tutte le categorie' : 
                     category === 'accommodation' ? 'Accommodation' :
                     category === 'profile' ? 'Profilo' : 'Generale'}
                  </option>
                ))}
              </select>
            </div>
            {selectedFiles.size > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Elimina ({selectedFiles.size})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{filteredFiles.length} immagine{filteredFiles.length !== 1 ? 'i' : ''} trovata{filteredFiles.length !== 1 ? 'e' : ''}</span>
        {files?.files && (
          <span>
            Totale: {files.files.reduce((acc, file) => acc + file.size, 0) > 0 ? 
              formatFileSize(files.files.reduce((acc, file) => acc + file.size, 0)) : '0 B'}
          </span>
        )}
      </div>

      {/* Images Grid/List */}
      {!files ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Caricamento...</p>
          </div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessuna immagine trovata</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Prova a modificare i filtri di ricerca' 
                : 'Carica le tue prime immagini usando il pannello sopra'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <Card 
              key={file._id} 
              className={`group cursor-pointer transition-all ${
                selectedFiles.has(file._id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleFileSelection(file._id)}
            >
              <CardContent className="p-2">
                <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden mb-2">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(file._id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {selectedFiles.has(file._id) && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {file.category || 'general'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredFiles.map((file) => (
                <div 
                  key={file._id} 
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedFiles.has(file._id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleFileSelection(file._id)}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    <Image
                      src={file.url}
                      alt={file.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge variant="secondary">
                          {file.category || 'general'}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Download functionality
                            window.open(file.url, '_blank')
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file._id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <HardDrive className="h-3 w-3 mr-1" />
                        {formatFileSize(file.size)}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(file.createdAt)}
                      </span>
                    </div>
                    
                    {file.description && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {file.description}
                      </p>
                    )}
                  </div>
                  
                  {selectedFiles.has(file._id) && (
                    <div className="ml-4">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
