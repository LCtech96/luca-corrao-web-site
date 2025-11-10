"use client"

import { useEffect, useState } from "react"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { useAuth } from "@/hooks/use-auth"
import { getAllUserProfiles, verifyHost, type UserProfile } from "@/lib/supabase/user-profiles-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, CheckCircle, XCircle, Shield, Home, Mail, Phone, ChevronLeft, Clock } from "lucide-react"
import Link from "next/link"

export default function UsersAdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [verifying, setVerifying] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !adminLoading && isAdmin) {
      loadUsers()
    }
  }, [authLoading, adminLoading, isAdmin])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (u) =>
            u.full_name.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.phone?.toLowerCase().includes(query) ||
            u.role.toLowerCase().includes(query)
        )
      )
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const allUsers = await getAllUserProfiles()
      setUsers(allUsers)
      setFilteredUsers(allUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: "Errore",
        description: "Impossibile caricare gli utenti",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyHost = async (hostEmail: string) => {
    if (!hostEmail) return

    setVerifying(hostEmail)
    try {
      await verifyHost(hostEmail)
      toast({
        title: "Host Verificato! ✅",
        description: "L'utente può ora listare proprietà",
      })
      await loadUsers()
    } catch (error: any) {
      console.error('Error verifying host:', error)
      toast({
        title: "Errore",
        description: error.message || "Impossibile verificare l'host",
        variant: "destructive"
      })
    } finally {
      setVerifying(null)
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

  const getRoleBadge = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: "bg-red-100 text-red-800",
      host: "bg-blue-100 text-blue-800",
      guest: "bg-gray-100 text-gray-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const pendingHosts = users.filter(u => u.is_host && !u.host_verified)
  const verifiedHosts = users.filter(u => u.is_host && u.host_verified)
  const regularGuests = users.filter(u => !u.is_host)
  const admins = users.filter(u => u.role === 'admin')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Gestione Utenti
              </h1>
              <p className="text-sm text-gray-600">Admin: {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Dashboard Admin
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
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-600 mt-1">Utenti Totali</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-red-600">{admins.length}</div>
                <div className="text-sm text-gray-600 mt-1">Amministratori</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">{verifiedHosts.length}</div>
                <div className="text-sm text-gray-600 mt-1">Host Verificati</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-amber-600">{pendingHosts.length}</div>
                <div className="text-sm text-gray-600 mt-1">Richieste Pending</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Host Requests */}
        {pendingHosts.length > 0 && (
          <Card className="mb-8 border-amber-200">
            <CardHeader className="bg-amber-50">
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Clock className="w-5 h-5" />
                Richieste Host da Approvare ({pendingHosts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pendingHosts.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{user.full_name}</h3>
                          <Badge className="bg-amber-100 text-amber-800">In Attesa</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          {user.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                        {user.host_bio && (
                          <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                            <strong>Bio:</strong> {user.host_bio}
                          </div>
                        )}
                        {user.host_languages && user.host_languages.length > 0 && (
                          <div className="mt-2 flex gap-1">
                            {user.host_languages.map((lang) => (
                              <Badge key={lang} variant="outline">{lang}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => user.email && handleVerifyHost(user.email)}
                        disabled={verifying === user.email}
                        className="bg-green-600 hover:bg-green-700 ml-4"
                      >
                        {verifying === user.email ? (
                          'Verifica...'
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approva Host
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cerca utenti per nome, email, telefono o ruolo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Tutti gli Utenti ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                Nessun utente trovato
              </div>
            ) : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{user.full_name}</h3>
                          <Badge className={getRoleBadge(user.role)}>
                            {user.role.toUpperCase()}
                          </Badge>
                          {user.is_host && (
                            <Badge className={user.host_verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                              {user.host_verified ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Host Verificato
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Host Pending
                                </>
                              )}
                            </Badge>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                          {user.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                          )}
                          {user.whatsapp_number && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-green-600" />
                              WhatsApp: {user.whatsapp_number}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Registrato: {new Date(user.created_at).toLocaleDateString('it-IT')}
                          {user.last_login && ` • Ultimo accesso: ${new Date(user.last_login).toLocaleDateString('it-IT')}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
