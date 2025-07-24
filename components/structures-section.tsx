"use client"

import { Button } from "@/components/ui/button"
import { X, ArrowLeft, MessageCircle, Phone, Mail } from "lucide-react"
import { AccommodationsSection } from "./accommodations-section"

interface StructuresSectionProps {
  onClose: () => void
}

export function StructuresSection({ onClose }: StructuresSectionProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Torna alla Home
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Strutture Ricettive</h1>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        <AccommodationsSection />

        {/* Contact Section - Only Hospitality Related */}
        <section className="py-20 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prenota il Tuo Soggiorno da Sogno</h2>
              <p className="text-xl text-amber-200 mb-12">
                Vivi un'esperienza unica nelle nostre strutture ricettive di eccellenza in Sicilia
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">WhatsApp</h4>
                  <Button
                    variant="link"
                    className="text-green-400 hover:text-green-300 p-0"
                    onClick={() => window.open("https://wa.me/+393514206353", "_blank")}
                  >
                    +39 351 420 6353
                  </Button>
                </div>

                <div className="text-center">
                  <Phone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Telefono</h4>
                  <Button
                    variant="link"
                    className="text-blue-400 hover:text-blue-300 p-0"
                    onClick={() => window.open("tel:+393513671340", "_blank")}
                  >
                    +39 351 367 1340
                  </Button>
                </div>

                <div className="text-center">
                  <Mail className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Email</h4>
                  <Button
                    variant="link"
                    className="text-purple-400 hover:text-purple-300 p-0"
                    onClick={() => window.open("mailto:luca@bedda.tech", "_blank")}
                  >
                    luca@bedda.tech
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-amber-300 mb-2">
                  © 2024 Luca Corrao. Tutti i diritti riservati. | Ospitalità Siciliana di Eccellenza
                </p>
                <p className="text-xs text-amber-400">🏖️ Terrasini, Palermo - Sicilia, Italia</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
