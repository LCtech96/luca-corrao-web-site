"use client"

import React, { useState } from "react"
import { Plus, Upload, Settings, Trash2, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { ImageGallery } from "@/components/ui/image-gallery"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface AdminImageManagerProps {
  /** Current user ID for ownership filtering */
  userId?: string
  /** Whether user has admin privileges */
  isAdmin?: boolean
  /** Additional CSS classes */
  className?: string
}

export function AdminImageManager({
  userId,
  isAdmin = false,
  className
}: AdminImageManagerProps) {
  const [activeTab, setActiveTab] = useState("gallery")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  // Get storage statistics
  const storageStats = useQuery(api.files.getStorageStats, {
    ownerId: isAdmin ? undefined : userId
  })

  const handleUploadComplete = (files: any[]) => {
    setUploadedFiles([])
    setUploadDialogOpen(false)
    // The ImageGallery will automatically refresh due to Convex real-time updates
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Gestione Immagini</h2>
            <p className="text-muted-foreground">
              Gestisci e organizza le tue immagini
            </p>
          </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Carica Immagini
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Carica Nuove Immagini</DialogTitle>
                <DialogDescription>
                  Seleziona le immagini da caricare nel tuo spazio
                </DialogDescription>
              </DialogHeader>
              
              <ImageUpload
                maxFiles={10}
                category="general"
                ownerId={userId}
                value={uploadedFiles}
                onChange={setUploadedFiles}
                onUploadComplete={handleUploadComplete}
                placeholder="Trascina qui le tue immagini o clicca per selezionarle"
                className="mt-4"
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Chiudi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        {storageStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totale File</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storageStats.totalFiles}</div>
                <p className="text-xs text-muted-foreground">
                  immagini caricate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spazio Utilizzato</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storageStats.totalSizeMB} MB</div>
                <p className="text-xs text-muted-foreground">
                  di spazio occupato
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorie</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(storageStats.categories).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  categorie utilizzate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Più Utilizzata</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.entries(storageStats.categories).length > 0
                    ? Object.entries(storageStats.categories).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A"
                    : "N/A"
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  categoria principale
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Breakdown */}
        {storageStats && Object.keys(storageStats.categories).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribuzione per Categoria</CardTitle>
              <CardDescription>
                Come sono distribuite le tue immagini per categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(storageStats.categories).map(([category, count]) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(selectedCategory === category ? "all" : category)}
                  >
                    {category}: {count}
                  </Badge>
                ))}
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                >
                  Tutte: {storageStats.totalFiles}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
            <TabsTrigger value="upload">Carica</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Amministrazione</TabsTrigger>}
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Galleria Immagini</CardTitle>
                <CardDescription>
                  Visualizza, gestisci e organizza le tue immagini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  category={selectedCategory === "all" ? undefined : selectedCategory}
                  ownerId={isAdmin ? undefined : userId}
                  manageable={true}
                  showActions={true}
                  customActions={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Aggiungi
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Carica Nuove Immagini</CardTitle>
                <CardDescription>
                  Aggiungi nuove immagini al tuo spazio di archiviazione
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bulk Upload for General Category */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Caricamento Generale</h4>
                  <ImageUpload
                    maxFiles={20}
                    category="general"
                    ownerId={userId}
                    value={[]}
                    onChange={() => {}}
                    placeholder="Carica immagini per uso generale"
                  />
                </div>

                {/* Category-specific uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Strutture</h4>
                    <ImageUpload
                      maxFiles={10}
                      category="structure"
                      ownerId={userId}
                      value={[]}
                      onChange={() => {}}
                      placeholder="Immagini di strutture e alloggi"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Profili</h4>
                    <ImageUpload
                      maxFiles={5}
                      category="profile"
                      ownerId={userId}
                      value={[]}
                      onChange={() => {}}
                      placeholder="Foto profilo e avatar"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Amministrazione Sistema</CardTitle>
                  <CardDescription>
                    Gestisci il sistema di archiviazione a livello globale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Global Statistics */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Statistiche Globali</h4>
                    <ImageGallery
                      manageable={true}
                      showActions={true}
                      customActions={
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Esporta
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Pulizia
                          </Button>
                        </div>
                      }
                    />
                  </div>

                  {/* System Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Download className="h-6 w-6 mb-2" />
                      Backup Completo
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Settings className="h-6 w-6 mb-2" />
                      Ottimizzazione
                    </Button>
                    <Button variant="destructive" className="h-20 flex-col">
                      <Trash2 className="h-6 w-6 mb-2" />
                      Pulizia File Orfani
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}

