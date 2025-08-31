// app/layout.tsx

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from '@clerk/nextjs'
// Temporarily removed Italian localization to fix build
// import { itIT } from "@clerk/localizations"; // Opzionale per la lingua
import { AuthProvider } from "@/lib/auth-context"
import { ConvexClientProvider } from "@/components/convex-provider"

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
  generator: 'v0.dev',
  other: {
    'preload-timeout': '3000',
    'x-dns-prefetch-control': 'on'
  }
}

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#fbbf24'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 1. Sposta ClerkProvider qui in alto per avvolgere tutto
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="it" className={inter.variable}>
        <head>
          {/* Performance optimizations */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://tidy-ibex-172.convex.cloud" />
          
          {/* Suppress development warnings */}
          {process.env.NODE_ENV === 'development' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    const originalWarn = console.warn;
                    console.warn = function(...args) {
                      if (args[0] && typeof args[0] === 'string') {
                        // Suppress preload warnings
                        if (args[0].includes('preloaded using link preload')) {
                          return;
                        }
                        // Suppress viewport/themeColor warnings (already fixed)
                        if (args[0].includes('Unsupported metadata viewport') || 
                            args[0].includes('Unsupported metadata themeColor')) {
                          return;
                        }
                      }
                      originalWarn.apply(console, args);
                    };
                  })();
                `,
              }}
            />
          )}
        </head>
        <body className={`${inter.className} antialiased`}>
          <ConvexClientProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}