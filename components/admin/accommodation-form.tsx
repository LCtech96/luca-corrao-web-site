"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { X, Plus, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { Id } from "@/convex/_generated/dataModel"

interface AccommodationFormProps {
  accommodationId?: Id<"accommodations">
  onCancel: () => void
  onSuccess?: () => void
}

interface UploadedFile {
  fileId: string
  storageId: string
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

export function AccommodationForm({ accommodationId, onCancel, onSuccess }: AccommodationFormProps) {
  const { userId } = useAuth()
  const createAccommodation = useMutation(api.accommodations.create)
  const updateAccommodation = useMutation(api.accommodations.update)
  const existingAccommodation = useQuery(
    api.accommodations.getById, 
    accommodationId ? { id: accommodationId } : "skip"
  )

  const [loading, setLoading] = useState(false)
  const [newFeature, setNewFeature] = useState("")
  const [newImageDescription, setNewImageDescription] = useState("")
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([])

  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    description: "",
    address: "",
    distance: "",
    capacity: "",
    features: [] as string[],
    highlight: "",
    mainImage: "",
    images: [] as string[],
    imageDescriptions: [] as string[],
    price: "",
    cleaningFee: 0,
    petsAllowed: false,
    petSupplement: 0,
    owner: "",
    rating: 5,
    isOwner: true,
  })

  // Load existing accommodation data
  useEffect(() => {
    if (existingAccommodation) {
      setFormData({
        name: existingAccommodation.name || "",
        subtitle: existingAccommodation.subtitle || "",
        description: existingAccommodation.description || "",
        address: existingAccommodation.address || "",
        distance: existingAccommodation.distance || "",
        capacity: existingAccommodation.capacity || "",
        features: existingAccommodation.features || [],
        highlight: existingAccommodation.highlight || "",
        mainImage: existingAccommodation.mainImage || "",
        images: existingAccommodation.images || [],
        imageDescriptions: existingAccommodation.imageDescriptions || [],
        price: existingAccommodation.price || "",
        cleaningFee: existingAccommodation.cleaningFee || 0,
        petsAllowed: existingAccommodation.petsAllowed || false,
        petSupplement: existingAccommodation.petSupplement || 0,
        owner: existingAccommodation.owner || "",
        rating: existingAccommodation.rating || 5,
        isOwner: existingAccommodation.isOwner || true,
      })
    }
  }, [existingAccommodation])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = (files: UploadedFile[]) => {
    setUploadedImages(prev => [...prev, ...files])
    
    // Update form data with new image URLs
    const newImageUrls = files.map(f => f.url)
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls],
      // Set first uploaded image as main image if not set
      mainImage: prev.mainImage || newImageUrls[0] || ""
    }))

    toast.success(`${files.length} immagine${files.length > 1 ? 'i' : ''} caricata${files.length > 1 ? 'e' : ''} con successo`)
  }

  const handleImageRemove = (fileId: string) => {
    const removedImage = uploadedImages.find(img => img.fileId === fileId)
    if (removedImage) {
      setUploadedImages(prev => prev.filter(img => img.fileId !== fileId))
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(url => url !== removedImage.url),
        // Clear main image if it was the removed one
        mainImage: prev.mainImage === removedImage.url ? (prev.images[0] || "") : prev.mainImage
      }))
    }
  }

  const setAsMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, mainImage: url }))
    toast.success("Immagine principale aggiornata")
  }

  const addImageDescription = () => {
    if (newImageDescription.trim()) {
      setFormData(prev => ({
        ...prev,
        imageDescriptions: [...prev.imageDescriptions, newImageDescription.trim()]
      }))
      setNewImageDescription("")
    }
  }

  const removeImageDescription = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageDescriptions: prev.imageDescriptions.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast.error("Devi essere autenticato per salvare")
      return
    }

    if (!formData.name.trim()) {
      toast.error("Il nome è obbligatorio")
      return
    }

    if (!formData.mainImage) {
      toast.error("È necessaria almeno un'immagine principale")
      return
    }

    setLoading(true)

    try {
      const accommodationData = {
        ...formData,
        owner: formData.owner || userId,
        cleaningFee: formData.cleaningFee || undefined,
        petSupplement: formData.petSupplement || undefined,
        rating: formData.rating || undefined,
      }

      if (accommodationId) {
        await updateAccommodation({
          id: accommodationId,
          ...accommodationData,
        })
        toast.success("Accommodation aggiornata con successo!")
      } else {
        await createAccommodation(accommodationData)
        toast.success("Accommodation creata con successo!")
      }

      onSuccess?.()
    } catch (error) {
      console.error("Error saving accommodation:", error)
      toast.error("Errore durante il salvataggio")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {accommodationId ? 'Modifica Accommodation' : 'Nuova Accommodation'}
          </h1>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Salvando...' : 'Salva'}</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome dell'accommodation"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Sottotitolo</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Breve descrizione"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrizione *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrizione dettagliata dell'accommodation"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="highlight">Punto di forza</Label>
              <Input
                id="highlight"
                value={formData.highlight}
                onChange={(e) => handleInputChange('highlight', e.target.value)}
                placeholder="Caratteristica principale da evidenziare"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Posizione e Capacità</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Indirizzo</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Via, Città, Provincia"
                />
              </div>
              <div>
                <Label htmlFor="distance">Distanze</Label>
                <Input
                  id="distance"
                  value={formData.distance}
                  onChange={(e) => handleInputChange('distance', e.target.value)}
                  placeholder="Es: 300m dal mare, 50m da Piazza Duomo"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="capacity">Capacità *</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Es: 4+1 persone"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Servizi e Caratteristiche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Aggiungi caratteristica (es: WiFi gratuito)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Immagini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
              category="accommodation"
              uploadedBy={userId}
              showPreview={true}
              showMetadata={true}
              multiple={true}
              maxFiles={20}
            />

            {formData.images.length > 0 && (
              <div>
                <Label>Immagine Principale</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {formData.images.map((url, index) => (
                    <div 
                      key={index} 
                      className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        formData.mainImage === url ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => setAsMainImage(url)}
                    >
                      <img
                        src={url}
                        alt={`Immagine ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                      {formData.mainImage === url && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <Badge variant="default">Principale</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Descriptions */}
            <div>
              <Label>Descrizioni Immagini (Opzionale)</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={newImageDescription}
                  onChange={(e) => setNewImageDescription(e.target.value)}
                  placeholder="Descrizione per l'immagine"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageDescription())}
                />
                <Button type="button" onClick={addImageDescription}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.imageDescriptions.map((desc, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <span>{desc}</span>
                    <button
                      type="button"
                      onClick={() => removeImageDescription(index)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Prezzi e Condizioni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prezzo *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Es: €120/notte"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cleaningFee">Pulizie Finali (€)</Label>
                <Input
                  id="cleaningFee"
                  type="number"
                  value={formData.cleaningFee}
                  onChange={(e) => handleInputChange('cleaningFee', Number(e.target.value))}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.petsAllowed}
                onCheckedChange={(checked) => handleInputChange('petsAllowed', checked)}
              />
              <Label>Animali ammessi</Label>
            </div>

            {formData.petsAllowed && (
              <div>
                <Label htmlFor="petSupplement">Supplemento animali (€)</Label>
                <Input
                  id="petSupplement"
                  type="number"
                  value={formData.petSupplement}
                  onChange={(e) => handleInputChange('petSupplement', Number(e.target.value))}
                  placeholder="20"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Proprietario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Proprietario</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  placeholder="Nome del proprietario"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={formData.isOwner}
                onCheckedChange={(checked) => handleInputChange('isOwner', checked)}
              />
              <Label>Sono il proprietario</Label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
