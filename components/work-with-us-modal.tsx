"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { Building2, Upload, MapPin, Image, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkWithUsModalProps {
  onClose: () => void
}

export function WorkWithUsModal({ onClose }: WorkWithUsModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<"form" | "success">("form")
  const [formData, setFormData] = useState({
    structureName: "",
    description: "",
    address: "",
    gpsCoordinates: "",
    coverImage: [] as Array<{fileId: string, fileName: string, fileType: string, fileSize: number, url: string, uploadProgress: number}>,
    structureImages: [] as Array<{fileId: string, fileName: string, fileType: string, fileSize: number, url: string, uploadProgress: number}>,
    documents: [] as File[]
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    return () => {
      // Cleanup quando il componente viene smontato
      setStep("form")
      setFormData({
        structureName: "",
        description: "",
        address: "",
        gpsCoordinates: "",
        coverImage: [],
        structureImages: [],
        documents: []
      })
      setErrors([])
      setIsLoading(false)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      onClose()
    }, 150)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors([])
  }

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return

    // Keep only for documents (non-images)
    if (field === 'documents') {
      const docFiles = Array.from(files)
      setFormData(prev => ({ ...prev, documents: docFiles }))
    }
  }

  const validateForm = () => {
    console.log('🔍 Validating form...')
    console.log('📋 structureName:', formData.structureName)
    console.log('📋 description:', formData.description)
    console.log('📋 address:', formData.address)
    console.log('📋 coverImage.length:', formData.coverImage.length)
    
    const newErrors: string[] = []
    
    if (!formData.structureName) {
      newErrors.push("Nome struttura è obbligatorio")
      console.log('❌ Nome mancante')
    }
    
    if (!formData.description) {
      newErrors.push("Descrizione è obbligatoria")
      console.log('❌ Descrizione mancante')
    }
    
    if (!formData.address) {
      newErrors.push("Indirizzo è obbligatorio")
      console.log('❌ Indirizzo mancante')
    }
    
    if (formData.coverImage.length === 0) {
      newErrors.push("Immagine di copertina è obbligatoria")
      console.log('❌ Copertina mancante')
    }
    
    console.log(`📊 Validation result: ${newErrors.length === 0 ? '✅ PASS' : '❌ FAIL'}`)
    console.log('❌ Errors:', newErrors)
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    console.log('🔍 Submit triggered, formData:', formData)
    
    if (!validateForm()) {
      console.log('❌ Validation failed')
      return
    }
    
    console.log('✅ Validation passed')
    setIsLoading(true)
    
    try {
      // Verifica se l'utente è registrato
      const userEmail = localStorage.getItem('userEmail')
      const accessToken = localStorage.getItem('googleAccessToken')
      
      console.log('👤 User:', userEmail, 'Token:', !!accessToken)
      
      if (!userEmail || !accessToken) {
        setErrors(["Devi prima registrarti e autenticarti con Google per caricare strutture"])
        setIsLoading(false)
        return
      }

      // Extract file IDs from uploaded images (può essere undefined)
      const mainImageFileId = formData.coverImage.length > 0 ? (formData.coverImage[0].fileId || null) : null
      const imageFileIds = formData.structureImages.map(file => file.fileId).filter(Boolean)
      
      // For backward compatibility, also send URLs
      const mainImageUrl = formData.coverImage.length > 0 ? formData.coverImage[0].url : ""
      const imageUrls = formData.structureImages.map(file => file.url).filter(Boolean)

      // Salva la struttura nel database
      console.log('📤 Sending to API:', {
        name: formData.structureName,
        mainImageUrl,
        imageUrls,
        mainImageFileId,
        imageFileIds
      })

      const response = await fetch('/api/structures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.structureName,
          description: formData.description,
          address: formData.address,
          gpsCoordinates: formData.gpsCoordinates,
          mainImage: mainImageUrl,
          images: imageUrls,
          mainImageFileId: mainImageFileId,
          imageFileIds: imageFileIds,
          owner: userEmail.split('@')[0], // Usa la parte prima della @ come nome
          ownerEmail: userEmail,
          accessToken
        })
      })

      console.log('📡 Response status:', response.status)
      const data = await response.json()
      console.log('📦 Response data:', data)
      
      if (data.success) {
        console.log('✅ Success! Switching to success step')
        setStep("success")
        
        // Forza il re-render
        setTimeout(() => {
          toast({
            title: "Struttura caricata!",
            description: "La tua struttura è stata inviata per approvazione.",
          })
        }, 100)
      } else {
        console.log('❌ Error from API:', data.error)
        setErrors([data.error || "Errore durante il salvataggio della struttura"])
      }
    } catch (error) {
      console.error('💥 Exception in handleSubmit:', error)
      setErrors([`Errore di connessione: ${error instanceof Error ? error.message : 'Unknown error'}`])
    } finally {
      console.log('🏁 handleSubmit completed, isLoading set to false')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Building2 className="w-5 h-5" />
            {step === "form" && "Carica la tua struttura"}
            {step === "success" && "Struttura caricata con successo"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {step === "form" && "Compila il form per aggiungere la tua struttura alla vetrina"}
            {step === "success" && "La tua struttura è stata inviata per approvazione"}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <div className="space-y-6">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="structureName" className="text-gray-900 dark:text-gray-100 font-medium">Nome Struttura *</Label>
                <Input
                  id="structureName"
                  placeholder="Es. Villa Panoramica"
                  value={formData.structureName}
                  onChange={(e) => handleInputChange("structureName", e.target.value)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-900 dark:text-gray-100 font-medium">Indirizzo *</Label>
                <Input
                  id="address"
                  placeholder="Via Example, Città, Provincia"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900 dark:text-gray-100 font-medium">Descrizione *</Label>
              <Textarea
                id="description"
                placeholder="Descrivi la tua struttura, i servizi offerti, le caratteristiche uniche..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpsCoordinates" className="text-gray-900 dark:text-gray-100 font-medium">Coordinate GPS (opzionale)</Label>
              <Input
                id="gpsCoordinates"
                placeholder="Es. 38.123456, 13.123456"
                value={formData.gpsCoordinates}
                onChange={(e) => handleInputChange("gpsCoordinates", e.target.value)}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100 font-medium">Immagine di Copertina *</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Prima immagine che apparirà nella vetrina
                </p>
                <ImageUpload
                  maxFiles={1}
                  category="cover"
                  ownerId={localStorage.getItem('userEmail') || undefined}
                  onImageUploaded={(url) => {
                    console.log('📸 Cover image uploaded:', url)
                    setFormData(prev => ({ ...prev, coverImage: [{ url, fileId: '', fileName: '', fileType: '', fileSize: 0, uploadProgress: 100 }] as any }))
                    setErrors([])
                  }}
                  className=""
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100 font-medium">Galleria Foto Struttura (max 20)</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Foto interne, esterne, servizi - Mostra le prime 4 in anteprima
                </p>
                <ImageUpload
                  maxFiles={20}
                  category="gallery"
                  ownerId={localStorage.getItem('userEmail') || undefined}
                  onImageUploaded={(url) => {
                    console.log('📸 Structure image uploaded:', url)
                    setFormData(prev => ({ 
                      ...prev, 
                      structureImages: [...prev.structureImages, { url, fileId: '', fileName: '', fileType: '', fileSize: 0, uploadProgress: 100 }] as any 
                    }))
                    setErrors([])
                  }}
                  className=""
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents" className="text-gray-900 dark:text-gray-100 font-medium">Documentazione (opzionale)</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800/50">
                  <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Carica documenti relativi alla struttura
                  </p>
                  <input
                    id="documents"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleFileChange("documents", e.target.files)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('documents')?.click()}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  >
                    Scegli Documenti
                  </Button>
                  {formData.documents.length > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      ✓ {formData.documents.length} documenti selezionati
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="button"
                onClick={async (e) => {
                  console.log('🔘 Button clicked! Event:', e.type)
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('🚀 Calling handleSubmit...')
                  console.log('📋 Current formData:', formData)
                  console.log('📊 isLoading:', isLoading)
                  
                  try {
                    await handleSubmit()
                    console.log('✅ handleSubmit returned successfully')
                  } catch (err) {
                    console.error('💥 Error in button onClick:', err)
                  }
                }}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Caricamento...
                  </span>
                ) : "Carica Struttura"}
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Annulla
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Struttura caricata con successo!</h3>
            <p className="text-gray-700 dark:text-gray-600">
              La tua struttura è stata inviata per approvazione. 
              Riceverai una notifica quando sarà pubblicata sulla vetrina.
            </p>
            <Button onClick={handleClose} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
              Chiudi
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 