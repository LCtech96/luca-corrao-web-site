"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { Building2, Upload, MapPin, Image, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface WorkWithUsModalProps {
  onClose: () => void
}

export function WorkWithUsModal({ onClose }: WorkWithUsModalProps) {
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
    const newErrors: string[] = []
    
    if (!formData.structureName) {
      newErrors.push("Nome struttura è obbligatorio")
    }
    
    if (!formData.description) {
      newErrors.push("Descrizione è obbligatoria")
    }
    
    if (!formData.address) {
      newErrors.push("Indirizzo è obbligatorio")
    }
    
    if (formData.coverImage.length === 0) {
      newErrors.push("Immagine di copertina è obbligatoria")
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Verifica se l'utente è registrato
      const userEmail = localStorage.getItem('userEmail')
      const accessToken = localStorage.getItem('googleAccessToken')
      
      if (!userEmail || !accessToken) {
        setErrors(["Devi prima registrarti e autenticarti con Google per caricare strutture"])
        return
      }

      // Extract file IDs from uploaded images
      const mainImageFileId = formData.coverImage.length > 0 ? formData.coverImage[0].fileId : ""
      const imageFileIds = formData.structureImages.map(file => file.fileId)
      
      // For backward compatibility, also send URLs
      const mainImageUrl = formData.coverImage.length > 0 ? formData.coverImage[0].url : ""
      const imageUrls = formData.structureImages.map(file => file.url)

      // Salva la struttura nel database
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

      const data = await response.json()
      
      if (data.success) {
        setStep("success")
      } else {
        setErrors([data.error || "Errore durante il salvataggio della struttura"])
      }
    } catch (error) {
      setErrors(["Errore di connessione. Riprova."])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {step === "form" && "Carica la tua struttura"}
            {step === "success" && "Struttura caricata con successo"}
          </DialogTitle>
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
                <Label htmlFor="structureName">Nome Struttura *</Label>
                <Input
                  id="structureName"
                  placeholder="Es. Villa Panoramica"
                  value={formData.structureName}
                  onChange={(e) => handleInputChange("structureName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Indirizzo *</Label>
                <Input
                  id="address"
                  placeholder="Via Example, Città, Provincia"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione *</Label>
              <Textarea
                id="description"
                placeholder="Descrivi la tua struttura, i servizi offerti, le caratteristiche uniche..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpsCoordinates">Coordinate GPS (opzionale)</Label>
              <Input
                id="gpsCoordinates"
                placeholder="Es. 38.123456, 13.123456"
                value={formData.gpsCoordinates}
                onChange={(e) => handleInputChange("gpsCoordinates", e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Immagine di Copertina *</Label>
                <ImageUpload
                  maxFiles={1}
                  category="structure"
                  ownerId={localStorage.getItem('userEmail') || undefined}
                  value={formData.coverImage}
                  onChange={(files) => {
                    setFormData(prev => ({ ...prev, coverImage: files }))
                    setErrors([])
                  }}
                  placeholder="Clicca per caricare l'immagine principale della struttura"
                  onError={(error) => setErrors([error])}
                />
              </div>

              <div className="space-y-2">
                <Label>Immagini della Struttura</Label>
                <ImageUpload
                  maxFiles={10}
                  category="structure"
                  ownerId={localStorage.getItem('userEmail') || undefined}
                  value={formData.structureImages}
                  onChange={(files) => {
                    setFormData(prev => ({ ...prev, structureImages: files }))
                    setErrors([])
                  }}
                  placeholder="Carica altre immagini della struttura (max 10)"
                  onError={(error) => setErrors([error])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documents">Documentazione (opzionale)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
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
                    variant="outline"
                    onClick={() => document.getElementById('documents')?.click()}
                  >
                    Scegli Documenti
                  </Button>
                  {formData.documents.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {formData.documents.length} documenti selezionati
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Caricamento in corso..." : "Carica Struttura"}
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Struttura caricata con successo!</h3>
            <p className="text-gray-600">
              La tua struttura è stata aggiunta alla vetrina. 
              Sarà visibile a tutti i visitatori del sito.
            </p>
            <Button onClick={handleClose} className="w-full">
              Chiudi
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 