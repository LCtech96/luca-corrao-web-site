"use client"

import { useState } from 'react'
import { ImageUpload } from '@/components/ui/image-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from "@clerk/nextjs"
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadedFile {
  fileId: string
  storageId: string
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

export default function TestUploadPage() {
  const { userId, isSignedIn } = useAuth()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleUpload = (files: UploadedFile[]) => {
    console.log('Files uploaded:', files)
    setUploadedFiles(prev => [...prev, ...files])
    setTestStatus('success')
    setErrorMessage('')
  }

  const handleRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.fileId !== fileId))
  }

  const testUpload = async () => {
    setTestStatus('testing')
    setErrorMessage('')
    
    try {
      // Test upload API connectivity
      const response = await fetch('/api/upload', {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error(`API test failed: ${response.status}`)
      }
      
      setTestStatus('success')
    } catch (error) {
      console.error('Test failed:', error)
      setTestStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Test failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Test Upload Immagini</h1>
          <p className="text-gray-600">
            Pagina di test per verificare il funzionamento dell'upload delle immagini
          </p>
        </div>

        {/* Authentication Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className={`h-5 w-5 ${isSignedIn ? 'text-green-500' : 'text-gray-400'}`} />
              <span>Stato Autenticazione</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSignedIn ? (
              <div className="text-green-600">
                ✅ Autenticato come: {userId}
              </div>
            ) : (
              <div className="text-orange-600">
                ⚠️ Non autenticato. Vai a <a href="/sign-in" className="underline">/sign-in</a> per accedere.
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Test API Connection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testUpload} disabled={testStatus === 'testing'}>
              {testStatus === 'testing' ? 'Testing...' : 'Test API Connection'}
            </Button>
            
            {testStatus === 'success' && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>API connection successful!</span>
              </div>
            )}
            
            {testStatus === 'error' && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Error: {errorMessage}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Test Upload Immagini</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSignedIn ? (
              <ImageUpload
                onUpload={handleUpload}
                onRemove={handleRemove}
                category="test"
                uploadedBy={userId}
                showPreview={true}
                showMetadata={true}
                multiple={true}
                maxFiles={5}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Effettua l'accesso per testare l'upload
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>File Caricati ({uploadedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((file) => (
                  <div key={file.fileId} className="border p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold">{file.fileName}</h3>
                        <p className="text-sm text-gray-600">Type: {file.fileType}</p>
                        <p className="text-sm text-gray-600">Size: {(file.fileSize / 1024).toFixed(2)} KB</p>
                        <p className="text-sm text-gray-600">ID: {file.fileId}</p>
                      </div>
                      <div className="flex justify-center">
                        <img
                          src={file.url}
                          alt={file.fileName}
                          className="max-w-32 max-h-32 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1 font-mono">
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>Convex URL: {process.env.NEXT_PUBLIC_CONVEX_URL}</div>
              <div>User ID: {userId || 'Not signed in'}</div>
              <div>Files uploaded: {uploadedFiles.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
