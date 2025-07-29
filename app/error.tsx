'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Qualcosa è andato storto!
        </h2>
        <p className="text-gray-600 mb-6">
          Si è verificato un errore imprevisto. Riprova o torna alla homepage.
        </p>
        <div className="space-x-4">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            Riprova
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Torna alla Homepage
          </Button>
        </div>
      </div>
    </div>
  )
} 