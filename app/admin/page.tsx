"use client"

import React from 'react'
import { useAuth } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Image as ImageIcon, Users, Activity, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { userId, isSignedIn } = useAuth()
  const accommodations = useQuery(api.accommodations.getAll)
  const files = useQuery(api.files.getFiles, { limit: 10 })

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

  const stats = [
    {
      title: "Accommodations",
      value: accommodations?.length || 0,
      icon: Home,
      href: "/admin/accommodations",
      color: "bg-blue-500"
    },
    {
      title: "Immagini Caricate",
      value: files?.files?.length || 0,
      icon: ImageIcon,
      href: "/admin/images",
      color: "bg-green-500"
    },
    {
      title: "Utenti Registrati",
      value: "12", // placeholder
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-500"
    },
    {
      title: "Upload Oggi",
      value: "5", // placeholder
      icon: TrendingUp,
      href: "/admin/images",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Panoramica delle tue attività e statistiche
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Azioni Rapide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/accommodations">
              <Button className="w-full justify-start" variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Aggiungi Nuova Accommodation
              </Button>
            </Link>
            <Link href="/admin/images">
              <Button className="w-full justify-start" variant="outline">
                <ImageIcon className="h-4 w-4 mr-2" />
                Carica Nuove Immagini
              </Button>
            </Link>
            <Link href="/admin/content">
              <Button className="w-full justify-start" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Modifica Contenuti Sito
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accommodations Recenti</CardTitle>
          </CardHeader>
          <CardContent>
            {!accommodations ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Caricamento...</p>
              </div>
            ) : accommodations.length === 0 ? (
              <div className="text-center py-4">
                <Home className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Nessuna accommodation trovata</p>
                <Link href="/admin/accommodations">
                  <Button size="sm" className="mt-2">
                    Crea la prima accommodation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {accommodations.slice(0, 3).map((accommodation) => (
                  <div key={accommodation._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={accommodation.mainImage || "/placeholder.svg"}
                        alt={accommodation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{accommodation.name}</p>
                      <p className="text-xs text-gray-600">{accommodation.capacity}</p>
                    </div>
                    <Link href="/admin/accommodations">
                      <Button size="sm" variant="ghost">Modifica</Button>
                    </Link>
                  </div>
                ))}
                {accommodations.length > 3 && (
                  <Link href="/admin/accommodations">
                    <Button variant="outline" size="sm" className="w-full">
                      Vedi tutte ({accommodations.length})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Immagini Recenti</span>
            <Link href="/admin/images">
              <Button variant="outline" size="sm">Vedi Tutte</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!files ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Caricamento...</p>
            </div>
          ) : files.files.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Nessuna immagine caricata</p>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2">
              {files.files.slice(0, 6).map((file) => (
                <div key={file._id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
