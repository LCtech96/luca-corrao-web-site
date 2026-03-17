// app/layout.tsx

import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SupabaseProvider } from "@/components/supabase-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { absoluteUrl, metadataBaseUrl } from "@/lib/seo"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: {
    default: "B&B e Appartamenti a Terrasini e Palermo | Sicilia, Italy",
    template: "%s | B&B e Appartamenti in Sicilia",
  },
  description:
    "B&B, affittacamere e appartamenti low cost a Terrasini e dintorni (Palermo, Sicilia). Prenota strutture con comfort moderni vicino al mare, in Italia: ideale per estate, vacanze e weekend.",
  keywords: [
    "bnb",
    "bed and breakfast",
    "b&b",
    "affittacamere",
    "appartamenti",
    "appartamento vacanze",
    "case vacanza",
    "low cost",
    "summer",
    "estate",
    "Palermo",
    "Terrasini",
    "Trappeto",
    "Sicily",
    "Sicilia",
    "Italy",
    "Italia",
    "near the sea",
    "vacation rental",
    "holiday apartment",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: absoluteUrl("/"),
    siteName: "B&B e Appartamenti in Sicilia",
    title: "B&B e Appartamenti a Terrasini e Palermo | Sicilia, Italy",
    description:
      "Strutture ricettive a Terrasini (Palermo): appartamenti e b&b vicino al mare, perfetti per vacanze estive in Sicilia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "B&B e Appartamenti a Terrasini e Palermo | Sicilia, Italy",
    description:
      "Prenota appartamenti e b&b vicino al mare a Terrasini (Palermo), Sicilia. Offerte low cost e comfort moderni.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  generator: "v0.dev",
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
      <html lang="it" className={inter.variable} suppressHydrationWarning>
        <head>
          {/* Performance optimizations */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://txszcieimfzqthkdzceb.supabase.co" />
          
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <SupabaseProvider>
                {children}
          </SupabaseProvider>
        </ThemeProvider>
        <Analytics />
        </body>
      </html>
  )
}