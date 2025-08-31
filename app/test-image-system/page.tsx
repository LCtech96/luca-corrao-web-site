"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/ui/image-upload"
import { ImageGallery } from "@/components/ui/image-gallery"
import { AdminImageManager } from "@/components/admin-image-manager"
import { 
  runAllImageTests, 
  testSchemaCompatibility, 
  type ImageUploadTestResults 
} from "@/lib/image-upload-test"
import { CheckCircle, XCircle, Play, Loader2 } from "lucide-react"

export default function TestImageSystemPage() {
  const [testResults, setTestResults] = useState<ImageUploadTestResults[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleRunTests = async () => {
    setIsRunningTests(true)
    setTestResults([])

    try {
      // Run schema compatibility test first
      const schemaTest = testSchemaCompatibility()
      setTestResults([schemaTest])

      // Run all other tests
      const allTests = await runAllImageTests()
      setTestResults([schemaTest, ...allTests])

    } catch (error) {
      console.error("Test execution failed:", error)
      setTestResults([{
        success: false,
        message: "Failed to execute tests",
        error: error instanceof Error ? error.message : String(error)
      }])
    } finally {
      setIsRunningTests(false)
    }
  }

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.success)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Sistema di Gestione Immagini - Test</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Questa pagina permette di testare il sistema completo di caricamento e gestione immagini 
          integrato con Convex file storage.
        </p>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Test di Sistema</CardTitle>
              <CardDescription>
                Verifica che tutti i componenti del sistema di gestione immagini funzionino correttamente
              </CardDescription>
            </div>
            <Button 
              onClick={handleRunTests} 
              disabled={isRunningTests}
              className="min-w-32"
            >
              {isRunningTests ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Esegui Test
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResults.length === 0 && !isRunningTests && (
            <Alert>
              <AlertDescription>
                Clicca "Esegui Test" per verificare il funzionamento del sistema
              </AlertDescription>
            </Alert>
          )}

          {testResults.map((result, index) => (
            <Alert key={index} variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className="flex-1">
                  <div className="font-medium">{result.message}</div>
                  {result.error && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Errore: {result.error}
                    </div>
                  )}
                  {result.details && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Dettagli: {JSON.stringify(result.details, null, 2)}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          ))}

          {testResults.length > 0 && (
            <div className="flex justify-center">
              <Badge variant={allTestsPassed ? "default" : "destructive"} className="text-sm">
                {allTestsPassed ? "✅ Tutti i test superati" : "❌ Alcuni test falliti"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Testing */}
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Test</TabsTrigger>
          <TabsTrigger value="gallery">Gallery Test</TabsTrigger>
          <TabsTrigger value="admin">Admin Test</TabsTrigger>
          <TabsTrigger value="integration">Integration Test</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Caricamento Immagini</CardTitle>
              <CardDescription>
                Testa il componente ImageUpload con drag & drop, preview e gestione degli errori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                maxFiles={5}
                category="test"
                ownerId="test-user"
                value={uploadedImages}
                onChange={setUploadedImages}
                placeholder="Trascina qui le immagini di test o clicca per selezionarle"
                onUploadStart={() => console.log("Upload started")}
                onUploadComplete={(files) => console.log("Upload completed:", files)}
                onError={(error) => console.error("Upload error:", error)}
                showFileDetails={true}
              />
              
              {uploadedImages.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">File caricati:</p>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(uploadedImages, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Galleria Immagini</CardTitle>
              <CardDescription>
                Testa il componente ImageGallery con ricerca, filtri e selezione multipla
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageGallery
                category="test"
                ownerId="test-user"
                selectable={true}
                multiSelect={true}
                selectedFiles={selectedImages}
                onSelectionChange={setSelectedImages}
                manageable={true}
                showActions={true}
              />
              
              {selectedImages.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Immagini selezionate:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map(id => (
                      <Badge key={id} variant="secondary">{id}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Interfaccia Admin</CardTitle>
              <CardDescription>
                Testa l'interfaccia di amministrazione completa per la gestione immagini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminImageManager
                userId="test-user"
                isAdmin={true}
                className="border rounded-lg p-4"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Integrazione Completa</CardTitle>
              <CardDescription>
                Simula il flusso completo dal caricamento alla gestione delle immagini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Step 1: Carica Immagine di Copertina</h4>
                <ImageUpload
                  maxFiles={1}
                  category="structure"
                  ownerId="test-user"
                  value={[]}
                  onChange={() => {}}
                  placeholder="Carica l'immagine principale della struttura"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Step 2: Carica Immagini Aggiuntive</h4>
                <ImageUpload
                  maxFiles={5}
                  category="structure"
                  ownerId="test-user"
                  value={[]}
                  onChange={() => {}}
                  placeholder="Carica immagini aggiuntive (max 5)"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Step 3: Gestisci Galleria</h4>
                <ImageGallery
                  category="structure"
                  ownerId="test-user"
                  manageable={true}
                  showActions={true}
                  viewMode="grid"
                />
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Flusso di Test Completo:</strong>
                  <br />1. Carica immagini usando i componenti sopra
                  <br />2. Verifica che appaiano nella galleria
                  <br />3. Testa le funzioni di modifica e cancellazione
                  <br />4. Controlla che i file ID vengano gestiti correttamente
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stato del Sistema</CardTitle>
          <CardDescription>
            Componenti implementati e funzionalità disponibili
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Convex File Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">ImageUpload Component</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">ImageGallery Component</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Admin Interface</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">API Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Schema Updates</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

