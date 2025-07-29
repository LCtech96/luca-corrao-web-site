'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-red-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              Errore Critico
            </h2>
            <p className="text-red-700 mb-6">
              Si è verificato un errore critico nell'applicazione.
            </p>
            <button
              onClick={reset}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Riprova
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 