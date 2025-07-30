// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from '@clerk/nextjs'
import { itIT } from "@clerk/localizations"; // Opzionale per la lingua
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Il tuo oggetto metadata va benissimo, lo lasciamo com'è
export const metadata: Metadata = {
  title: "Luca Corrao - Intelligenza Artificiale & Ospitalità Siciliana | AI Development & Strutture Ricettive Terrasini",
  description: "Luca Corrao: Esperto in Intelligenza Artificiale, AI Development, Machine Learning e proprietario di strutture ricettive premium in Sicilia. Consulenza IT, AI Agent, automazione software e ospitalità di eccellenza a Terrasini, Palermo.",
  // ...il resto dei tuoi metadati...
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 1. Sposta ClerkProvider qui in alto per avvolgere tutto
    <ClerkProvider localization={itIT} publishableKey={clerkPublishableKey}>
      <html lang="it" className={inter.variable}>
        {/* 2. Rimuovi il tag <head> manuale. Next.js lo gestisce tramite l'oggetto metadata */}
        <body className={`${inter.className} antialiased`}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
