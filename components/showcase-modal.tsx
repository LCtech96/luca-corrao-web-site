"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, MapPin, Star, Eye, X, Plus, Upload, User } from "lucide-react"
import Image from "next/image"

interface ShowcaseModalProps {
  onClose: () => void
}

interface Structure {
  id: string
  name: string
  description: string
  address: string
  rating: number
  mainImage: string
  images: string[]
  owner: string
  isOwner: boolean
}

export function ShowcaseModal({ onClose }: ShowcaseModalProps) {
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isUserRegistered, setIsUserRegistered] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const structuresPerPage = 12

  // Strutture di esempio (solo le tue)
  const sampleStructures: Structure[] = [
    {
      id: "1",
      name: "Lucas Rooftop",
      description: "Esclusivo rooftop con vista panoramica su Terrasini. Ideale per soggiorni romantici e momenti indimenticabili.",
      address: "Via Panoramica, Terrasini, PA",
      rating: 4.8,
      mainImage: "/images/lucas-rooftop-terrace.jpg",
      images: [
        "/images/lucas-rooftop-terrace.jpg",
        "/images/lucas-rooftop-bedroom-1.jpg",
        "/images/lucas-rooftop-bedroom-2.jpg",
        "/images/lucas-rooftop-kitchen.jpg",
        "/images/lucas-rooftop-bathroom.jpg"
      ],
      owner: "Luca Corrao",
      isOwner: true
    },
    {
      id: "2",
      name: "Lucas Suite",
      description: "Suite di lusso con design moderno e comfort esclusivo. Perfetta per chi cerca eleganza e relax.",
      address: "Via del Mare, Terrasini, PA",
      rating: 4.9,
      mainImage: "/images/bedroom-historic-1.jpg",
      images: [
        "/images/bedroom-historic-1.jpg",
        "/images/bedroom-historic-2.jpg",
        "/images/bathroom-modern.jpg",
        "/images/ceiling-fresco-1.jpg"
      ],
      owner: "Luca Corrao",
      isOwner: true
    }
  ]

  // Carica strutture dal database (simulato)
  const [allStructures, setAllStructures] = useState<Structure[]>(sampleStructures)

  useEffect(() => {
    return () => {
      // Cleanup quando il componente viene smontato
      setSelectedStructure(null)
      setCurrentPage(1)
      setShowUploadModal(false)
      setUploadError(null)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      onClose()
    }, 150)
  }

  // Verifica se l'utente è registrato
  useEffect(() => {
    const checkUserRegistration = () => {
      // Simula verifica utente registrato (in produzione controllerebbe il database)
      const userEmail = localStorage.getItem('userEmail')
      const isRegistered = userEmail && userEmail.includes('@')
      setIsUserRegistered(isRegistered)
    }

    checkUserRegistration()
  }, [])

  // Calcola le strutture per la pagina corrente
  const startIndex = (currentPage - 1) * structuresPerPage
  const endIndex = startIndex + structuresPerPage
  const currentStructures = allStructures.slice(startIndex, endIndex)
  const totalPages = Math.ceil(allStructures.length / structuresPerPage)

  // Aggiungi slot vuoti per completare la griglia
  const emptySlots = structuresPerPage - currentStructures.length
  const emptyStructures = Array.from({ length: emptySlots }, (_, index) => ({
    id: `empty-${index}`,
    name: "",
    description: "",
    address: "",
    rating: 0,
    mainImage: "",
    images: [],
    owner: "",
    isOwner: false,
    isEmpty: true
  }))

  const displayStructures = [...currentStructures, ...emptyStructures]

  const handleUploadClick = () => {
    if (!isUserRegistered) {
      setUploadError("Devi prima effettuare la registrazione per caricare le tue strutture.")
      return
    }
    setShowUploadModal(true)
    setUploadError(null)
  }

  const handleUploadStructure = async (formData: FormData) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      // Simula upload al server
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aggiungi la nuova struttura
      const newStructure: Structure = {
        id: Date.now().toString(),
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        address: formData.get('address') as string,
        rating: 0,
        mainImage: "/images/placeholder.jpg", // In produzione sarebbe l'URL dell'immagine caricata
        images: ["/images/placeholder.jpg"],
        owner: localStorage.getItem('userEmail') || 'Utente Registrato',
        isOwner: true
      }

      setAllStructures(prev => [...prev, newStructure])
      setShowUploadModal(false)
    } catch (error) {
      setUploadError("Errore durante il caricamento. Riprova.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Vetrina Strutture
          </DialogTitle>
        </DialogHeader>

        {uploadError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Griglia Strutture */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {displayStructures.map((structure, index) => (
            <div key={structure.id} className="relative">
              {structure.isEmpty ? (
                // Slot vuoto con pulsante +
                <div 
                  className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleUploadClick}
                >
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aggiungi Struttura</p>
                  </div>
                </div>
              ) : (
                // Struttura esistente
                <div 
                  className="aspect-square bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedStructure(structure)}
                >
                  <div className="relative h-full">
                    <Image
                      src={structure.mainImage}
                      alt={structure.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="font-semibold text-sm truncate">{structure.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{structure.rating}</span>
                      </div>
                    </div>
                    {structure.isOwner && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs">
                        Mia
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Paginazione */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Precedente
            </Button>
            <span className="flex items-center px-4">
              Pagina {currentPage} di {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Successiva
            </Button>
          </div>
        )}

        {/* Modal Upload Struttura */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Carica la tua struttura</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleUploadStructure(formData)
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Struttura</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Es. Villa Panoramica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrizione</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Descrivi la tua struttura..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Indirizzo</label>
                  <input
                    name="address"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Via Example, Città, Provincia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Immagine Principale</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Clicca per caricare l'immagine</p>
                    <input
                      name="mainImage"
                      type="file"
                      accept="image/*"
                      required
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? "Caricamento..." : "Carica Struttura"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Annulla
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dettagli struttura - Mostrato inline invece che in modal separato */}
        {selectedStructure && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{selectedStructure.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStructure(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={selectedStructure.mainImage}
                        alt={selectedStructure.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Descrizione</h4>
                      <p className="text-gray-600">{selectedStructure.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedStructure.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{selectedStructure.rating}</span>
                      <span className="text-gray-600">/ 5</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Proprietario: {selectedStructure.owner}</span>
                    </div>
                  </div>
                </div>

                {selectedStructure.images.length > 1 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Altre Immagini</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {selectedStructure.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${selectedStructure.name} - Immagine ${index + 2}`}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 