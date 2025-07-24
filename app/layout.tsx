import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title:
    "Luca Corrao - Intelligenza Artificiale & Ospitalità Siciliana | AI Development & Strutture Ricettive Terrasini",
  description:
    "Luca Corrao: Esperto in Intelligenza Artificiale, AI Development, Machine Learning e proprietario di strutture ricettive premium in Sicilia. Consulenza IT, AI Agent, automazione software e ospitalità di eccellenza a Terrasini, Palermo.",
  keywords:
    "Luca Corrao, Intelligenza Artificiale, AI Development, Sviluppo Software, Consulenza IT, AI Agent, Machine Learning, Deep Learning, Automazione AI, Soluzioni Software, Strutture ricettive Terrasini, B&B Terrasini, Casa vacanze Terrasini, Lucas Suite, Lucas Rooftop, Soggiorno Terrasini, Vacanze Sicilia, Ospitalità Sicilia, Consulenza aziendale, Trasformazione digitale",
  authors: [{ name: "Luca Corrao" }],
  creator: "Luca Corrao",
  publisher: "Luca Corrao",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://lucacorrao.com",
    siteName: "Luca Corrao - AI & Ospitalità",
    title: "Luca Corrao - Intelligenza Artificiale & Ospitalità Siciliana",
    description:
      "Esperto in AI Development e proprietario di strutture ricettive premium in Sicilia. Innovazione tecnologica e accoglienza autentica.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luca Corrao - AI Development & Ospitalità Siciliana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luca Corrao - AI & Ospitalità Siciliana",
    description: "Intelligenza Artificiale, sviluppo software e strutture ricettive premium in Sicilia",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://lucacorrao.com",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Luca Corrao",
              jobTitle: "AI Developer & Hospitality Entrepreneur",
              description:
                "Esperto in Intelligenza Artificiale, sviluppo software e proprietario di strutture ricettive premium in Sicilia",
              url: "https://lucacorrao.com",
              email: "luca@bedda.tech",
              sameAs: ["https://linkedin.com/in/lucacorrao", "https://github.com/lucacorrao"],
              knowsAbout: [
                "Intelligenza Artificiale",
                "Machine Learning",
                "Sviluppo Software",
                "AI Agent Development",
                "Automazione AI",
                "Consulenza IT",
                "Ospitalità",
                "Gestione Strutture Ricettive",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Terrasini",
                addressRegion: "Sicilia",
                addressCountry: "IT",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
