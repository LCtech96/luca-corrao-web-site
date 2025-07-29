'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-gray-900 mb-4">404</h2>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Pagina non trovata
        </h3>
        <p className="text-gray-600 mb-6">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="space-x-4">
          <Button
            asChild
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            <Link href="/">
              Torna alla Homepage
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Torna Indietro
          </Button>
        </div>
      </div>
    </div>
  )
} 