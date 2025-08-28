"use client"

import React, { useState } from 'react'
import { useAuth } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AccommodationForm } from '@/components/admin/accommodation-form'
import { Plus, Edit, Trash2, Eye, Users } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import type { Id } from "@/convex/_generated/dataModel"

type ViewMode = 'list' | 'create' | 'edit'

export default function AdminAccommodationsPage() {
  const { userId, isSignedIn } = useAuth()
  const accommodations = useQuery(api.accommodations.getAll)
  const removeAccommodation = useMutation(api.accommodations.remove)

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingId, setEditingId] = useState<Id<"accommodations"> | undefined>()

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

  const handleCreate = () => {
    setEditingId(undefined)
    setViewMode('create')
  }

  const handleEdit = (id: Id<"accommodations">) => {
    setEditingId(id)
    setViewMode('edit')
  }

  const handleDelete = async (id: Id<"accommodations">) => {
    if (confirm('Sei sicuro di voler eliminare questa accommodation?')) {
      try {
        await removeAccommodation({ id })
        toast.success('Accommodation eliminata con successo')
      } catch (error) {
        console.error('Error deleting accommodation:', error)
        toast.error('Errore durante l\'eliminazione')
      }
    }
  }

  const handleSuccess = () => {
    setViewMode('list')
    setEditingId(undefined)
    toast.success('Operazione completata con successo!')
  }

  const handleCancel = () => {
    setViewMode('list')
    setEditingId(undefined)
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <AccommodationForm
        accommodationId={editingId}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestione Accommodations</h1>
          <p className="text-gray-600 mt-1">
            Gestisci le tue strutture ricettive e carica nuove immagini
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuova Accommodation</span>
        </Button>
      </div>

      {!accommodations ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Caricamento...</p>
          </div>
        </div>
      ) : accommodations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Users className="h-12 w-12 mx-auto mb-2" />
              <p>Nessuna accommodation trovata</p>
            </div>
            <Button onClick={handleCreate}>Crea la prima accommodation</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => (
            <Card key={accommodation._id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={accommodation.mainImage || "/placeholder.svg"}
                    alt={accommodation.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => handleEdit(accommodation._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => handleDelete(accommodation._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {accommodation.highlight && (
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-blue-600 text-white">
                        {accommodation.highlight}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{accommodation.name}</h3>
                    {accommodation.subtitle && (
                      <p className="text-sm text-gray-600">{accommodation.subtitle}</p>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {accommodation.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{accommodation.capacity}</span>
                    </div>
                    <Badge variant="outline">{accommodation.price}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{accommodation.images.length} immagini</span>
                    <span>
                      {accommodation.isActive ? (
                        <Badge variant="default" className="text-xs">Attiva</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Inattiva</Badge>
                      )}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(accommodation._id)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifica
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Open preview modal
                        toast.info('Anteprima non ancora implementata')
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
