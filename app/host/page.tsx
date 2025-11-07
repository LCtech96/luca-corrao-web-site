"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getCurrentUserProfile, requestHostStatus, isHost, canCreateAccommodations, type UserProfile } from "@/lib/supabase/user-profiles-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Home, CheckCircle, Clock, Plus, Settings, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function HostDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [requestingHost, setRequestingHost] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const { toast } = useToast()
  
  // Form per richiesta host
  const [hostBio, setHostBio] = useState("")
  const [hostLanguages, setHostLanguages] = useState<string[]>([])
  const [languageInput, setLanguageInput] = useState("")

  useEffect(() => {
    if (!authLoading) {
      loadProfile()
    }
  }, [authLoading])

  const loadProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
      toast({
        title: "Errore",
        description: "Impossibile caricare il profilo",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestHostStatus = async () => {
    if (!hostBio.trim()) {
      toast({
        title: "Bio richiesta",
        description: "Inserisci una breve descrizione di te",
        variant: "destructive"
      })
      return
    }

    setRequestingHost(true)
    try {
      await requestHostStatus(hostBio, hostLanguages.length > 0 ? hostLanguages : undefined)
      toast({
        title: "Richiesta inviata! ✅",
        description: "Riceverai una conferma via email quando sarà approvata",
      })
      await loadProfile()
      setShowRequestForm(false)
    } catch (error: any) {
      console.error('Error requesting host status:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile inviare la richiesta",
        variant: "destructive"
      })
    } finally {
      setRequestingHost(false)
    }
  }

  const addLanguage = () => {
    if (languageInput.trim() && !hostLanguages.includes(languageInput.trim())) {
      setHostLanguages([...hostLanguages, languageInput.trim()])
      setLanguageInput("")
    }
  }

  const removeLanguage = (lang: string) => {
    setHostLanguages(hostLanguages.filter(l => l !== lang))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Accesso Richiesto</h1>
          <p className="text-gray-600 mb-6">
            Devi essere autenticato per accedere a questa pagina.
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

  // User non è ancora host - Mostra form per richiedere status
  if (!profile?.is_host || !profile?.host_verified) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Diventa Host</h1>
                <p className="text-sm text-gray-600">Lista le tue proprietà su Luca Corrao</p>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Torna al Sito
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {profile?.is_host && !profile?.host_verified ? (
            // Richiesta in attesa
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <Clock className="w-6 h-6" />
                  Richiesta in Attesa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  La tua richiesta per diventare host è stata ricevuta e sarà verificata al più presto da un amministratore.
                </p>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-800">
                    📧 Riceverai una notifica via email quando la tua richiesta sarà approvata.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : !showRequestForm ? (
            // Pagina informativa
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-6 h-6 text-blue-600" />
                    Perché diventare Host?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Raggiungi più ospiti</h3>
                      <p className="text-sm text-gray-600">La tua proprietà sarà visibile a migliaia di potenziali ospiti</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Gestione semplificata</h3>
                      <p className="text-sm text-gray-600">Dashboard intuitiva per gestire prenotazioni e comunicazioni</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Pagamenti sicuri</h3>
                      <p className="text-sm text-gray-600">Supporto per Revolut, bonifico e pagamenti crypto</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Supporto dedicato</h3>
                      <p className="text-sm text-gray-600">Team di supporto sempre disponibile per aiutarti</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => setShowRequestForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Richiedi di Diventare Host
              </Button>
            </div>
          ) : (
            // Form per richiedere status host
            <Card>
              <CardHeader>
                <CardTitle>Richiesta per Diventare Host</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="host-bio">Bio / Presentazione *</Label>
                  <Textarea
                    id="host-bio"
                    value={hostBio}
                    onChange={(e) => setHostBio(e.target.value)}
                    placeholder="Presentati brevemente e racconta perché vuoi diventare host..."
                    rows={5}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Descrivi te stesso e la tua esperienza come host (minimo 50 caratteri)
                  </p>
                </div>

                <div>
                  <Label htmlFor="languages">Lingue Parlate (Opzionale)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="languages"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      placeholder="es. Italiano, Inglese, Francese..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addLanguage()
                        }
                      }}
                    />
                    <Button type="button" onClick={addLanguage} variant="outline">
                      Aggiungi
                    </Button>
                  </div>
                  {hostLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hostLanguages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="cursor-pointer" onClick={() => removeLanguage(lang)}>
                          {lang} ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ La tua richiesta sarà verificata da un amministratore. Riceverai una conferma via email.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleRequestHostStatus}
                    disabled={requestingHost || !hostBio.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {requestingHost ? 'Invio...' : 'Invia Richiesta'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                    disabled={requestingHost}
                  >
                    Annulla
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // User è host verificato - Mostra dashboard host
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Home className="w-6 h-6 text-blue-600" />
                Dashboard Host
              </h1>
              <p className="text-sm text-gray-600">Benvenuto, {profile.full_name}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/structures">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Gestisci Proprietà
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Torna al Sito
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Proprietà Attive</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Prenotazioni Totali</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">€0</div>
                <div className="text-sm text-gray-600 mt-1">Guadagno Totale</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inizia a Listare le Tue Proprietà</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">
                Non hai ancora listato nessuna proprietà. Inizia ora per raggiungere migliaia di potenziali ospiti!
              </p>
              <Link href="/admin/structures">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Aggiungi Prima Proprietà
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

