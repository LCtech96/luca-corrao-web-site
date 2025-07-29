'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ClerkProviderWrapperProps {
  children: ReactNode
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Se non c'è una chiave valida, mostra solo l'applicazione senza autenticazione
  if (!clerkPublishableKey || clerkPublishableKey === 'pk_test_your-clerk-publishable-key' || clerkPublishableKey === 'pk_test_your-actual-key' || clerkPublishableKey === 'pk_test_dummy') {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Luca Corrao
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                Innovazione AI & Eccellenza nell'Ospitalità Siciliana
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Configurazione Autenticazione
              </h2>
              <p className="text-gray-600 mb-4">
                Per abilitare l'autenticazione, configura le chiavi API di Clerk nel file <code>.env.local</code>
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-left mb-4">
                <p>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key</p>
                <p>CLERK_SECRET_KEY=sk_test_your-actual-key</p>
              </div>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://dashboard.clerk.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors"
                >
                  Clerk Dashboard
                </a>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Ricarica Pagina
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Strutture Ricettive</h3>
                <p className="text-gray-600">
                  Scopri le nostre strutture ricettive premium in Sicilia
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Soluzioni AI</h3>
                <p className="text-gray-600">
                  Esplora le nostre soluzioni di intelligenza artificiale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {children}
    </ClerkProvider>
  )
} 