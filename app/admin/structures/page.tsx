"use client"

import { useEffect, useState } from "react"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { useAuth } from "@/hooks/use-auth"
import { 
  getAllStructures, 
  approveStructure, 
  rejectStructure, 
  deleteStructure,
  subscribeToStructures,
  type Structure 
} from "@/lib/supabase/structures-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  ChevronLeft, 
  Check, 
  X, 
  Trash2, 
  MapPin, 
  User, 
  Mail,
  Calendar,
  Eye,
  Filter
} from "lucide-react"
import Link from "next/link"

export default function StructuresAdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [structures, setStructures] = useState<Structure[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !adminLoading && isAdmin) {
      loadData()
    }
  }, [authLoading, adminLoading, isAdmin])

  useEffect(() => {
    if (isAdmin) {
      const unsubscribe = subscribeToStructures((data) => {
        setStructures(data)
      })
      return () => unsubscribe()
    }
  }, [isAdmin])

  const loadData = async () => {
    setLoading(true)
    const data = await getAllStructures()
    setStructures(data)
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id)
      await approveStructure(id)
      await loadData()
      alert('✅ Struttura approvata con successo!')
    } catch (error) {
      console.error('Error approving structure:', error)
      alert('❌ Errore nell\'approvazione della struttura')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Sei sicuro di voler rifiutare questa struttura?')) return
    
    try {
      setActionLoading(id)
      await rejectStructure(id)
      await loadData()
      alert('❌ Struttura rifiutata')
    } catch (error) {
      console.error('Error rejecting structure:', error)
      alert('❌ Errore nel rifiuto della struttura')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa struttura? Questa azione è irreversibile!')) return
    
    try {
      setActionLoading(id)
      const success = await deleteStructure(id)
      if (success) {
        await loadData()
        setSelectedStructure(null)
        alert('🗑️ Struttura eliminata con successo')
      } else {
        alert('❌ Errore nell\'eliminazione della struttura')
      }
    } catch (error) {
      console.error('Error deleting structure:', error)
      alert('❌ Errore nell\'eliminazione della struttura')
    } finally {
      setActionLoading(null)
    }
  }

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Accesso Negato</h1>
          <p className="text-gray-600 mb-6">
            Solo gli amministratori possono accedere a questa pagina.
          </p>
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const filteredStructures = structures.filter(s => {
    if (filter === 'all') return true
    return s.status === filter
  })

  const pendingCount = structures.filter(s => s.status === 'pending').length
  const approvedCount = structures.filter(s => s.status === 'approved').length
  const rejectedCount = structures.filter(s => s.status === 'rejected').length

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: <Badge className="bg-yellow-100 text-yellow-800">In Attesa</Badge>,
      approved: <Badge className="bg-green-100 text-green-800">Approvata</Badge>,
      rejected: <Badge className="bg-red-100 text-red-800">Rifiutata</Badge>
    }
    return badges[status as keyof typeof badges] || <Badge>Sconosciuto</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-amber-600" />
                Gestione Strutture
              </h1>
              <p className="text-sm text-gray-600">Approva o rifiuta le strutture caricate dagli utenti</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  Torna al Sito
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm mb-2">Totale Strutture</h3>
            <p className="text-3xl font-bold text-gray-900">{structures.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-gray-600 text-sm mb-2">In Attesa</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-gray-600 text-sm mb-2">Approvate</h3>
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <h3 className="text-gray-600 text-sm mb-2">Rifiutate</h3>
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtra per stato:</span>
            <Button
              size="sm"
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              className={filter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            >
              In Attesa ({pendingCount})
            </Button>
            <Button
              size="sm"
              variant={filter === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilter('approved')}
              className={filter === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Approvate ({approvedCount})
            </Button>
            <Button
              size="sm"
              variant={filter === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilter('rejected')}
              className={filter === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Rifiutate ({rejectedCount})
            </Button>
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Tutte ({structures.length})
            </Button>
          </div>
        </div>

        {/* Structures List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento strutture...</p>
          </div>
        ) : filteredStructures.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nessuna struttura {filter !== 'all' ? `${filter === 'pending' ? 'in attesa' : filter === 'approved' ? 'approvata' : 'rifiutata'}` : 'trovata'}
            </h3>
            <p className="text-gray-500">
              {filter === 'pending' && 'Le nuove richieste appariranno qui'}
              {filter === 'approved' && 'Nessuna struttura è stata ancora approvata'}
              {filter === 'rejected' && 'Nessuna struttura è stata rifiutata'}
              {filter === 'all' && 'Non ci sono strutture nel sistema'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredStructures.map((structure) => (
              <div key={structure.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{structure.name}</h3>
                        {getStatusBadge(structure.status)}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Proprietario: <strong>{structure.owner}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{structure.ownerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{structure.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Caricata il: {new Date(structure.createdAt).toLocaleDateString('it-IT')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <img
                        src={structure.mainImage}
                        alt={structure.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{structure.description}</p>
                  </div>

                  {/* Images Preview */}
                  {structure.images && structure.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Galleria ({structure.images.length} immagini):</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {structure.images.slice(0, 5).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${structure.name} - ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                          />
                        ))}
                        {structure.images.length > 5 && (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-600">+{structure.images.length - 5}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedStructure(structure)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Dettagli
                    </Button>
                    
                    {structure.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(structure.id)}
                          disabled={actionLoading === structure.id}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {actionLoading === structure.id ? 'Approvazione...' : 'Approva'}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleReject(structure.id)}
                          disabled={actionLoading === structure.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          {actionLoading === structure.id ? 'Rifiuto...' : 'Rifiuta'}
                        </Button>
                      </>
                    )}

                    {structure.status === 'rejected' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(structure.id)}
                        disabled={actionLoading === structure.id}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Riapprova
                      </Button>
                    )}

                    {structure.status === 'approved' && (
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleReject(structure.id)}
                        disabled={actionLoading === structure.id}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Disattiva
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(structure.id)}
                      disabled={actionLoading === structure.id}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Elimina
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedStructure && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStructure(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedStructure.name}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStructure(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Main Image */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Immagine di Copertina</h3>
                <img
                  src={selectedStructure.mainImage}
                  alt={selectedStructure.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Informazioni</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Proprietario</p>
                        <p className="text-gray-600">{selectedStructure.owner}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{selectedStructure.ownerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Indirizzo</p>
                        <p className="text-gray-600">{selectedStructure.address}</p>
                      </div>
                    </div>
                    {selectedStructure.gpsCoordinates && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Coordinate GPS</p>
                          <p className="text-gray-600">{selectedStructure.gpsCoordinates}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Stato</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium mb-1">Status</p>
                      {getStatusBadge(selectedStructure.status)}
                    </div>
                    <div>
                      <p className="font-medium">Data caricamento</p>
                      <p className="text-gray-600">{new Date(selectedStructure.createdAt).toLocaleString('it-IT')}</p>
                    </div>
                    <div>
                      <p className="font-medium">Ultimo aggiornamento</p>
                      <p className="text-gray-600">{new Date(selectedStructure.updatedAt).toLocaleString('it-IT')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Descrizione</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{selectedStructure.description}</p>
              </div>

              {/* Gallery */}
              {selectedStructure.images && selectedStructure.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Galleria Immagini ({selectedStructure.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedStructure.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedStructure.name} - ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedStructure.status === 'pending' && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={() => {
                        handleApprove(selectedStructure.id)
                        setSelectedStructure(null)
                      }}
                      disabled={actionLoading === selectedStructure.id}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approva Struttura
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 flex-1"
                      onClick={() => {
                        handleReject(selectedStructure.id)
                        setSelectedStructure(null)
                      }}
                      disabled={actionLoading === selectedStructure.id}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rifiuta Struttura
                    </Button>
                  </>
                )}
                {selectedStructure.status === 'approved' && (
                  <Button
                    className="bg-red-600 hover:bg-red-700 flex-1"
                    onClick={() => {
                      handleReject(selectedStructure.id)
                      setSelectedStructure(null)
                    }}
                    disabled={actionLoading === selectedStructure.id}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Disattiva Struttura
                  </Button>
                )}
                {selectedStructure.status === 'rejected' && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => {
                      handleApprove(selectedStructure.id)
                      setSelectedStructure(null)
                    }}
                    disabled={actionLoading === selectedStructure.id}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Riapprova Struttura
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedStructure.id)
                  }}
                  disabled={actionLoading === selectedStructure.id}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Elimina
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
