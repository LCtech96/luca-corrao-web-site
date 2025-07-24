"use client"

import { Button } from "@/components/ui/button"
import { X, ArrowLeft, MessageCircle, Phone, Mail, Bot } from "lucide-react"
import { AboutSection } from "./about-section"
import { FeaturesSection } from "./features-section"
import { VoiceAISection } from "./voice-ai-section"

interface AISolutionsSectionProps {
  onClose: () => void
}

export function AISolutionsSection({ onClose }: AISolutionsSectionProps) {
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
            <h1 className="text-2xl font-bold text-gray-900">Soluzioni AI</h1>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        <AboutSection />
        <FeaturesSection />
        <VoiceAISection />

        {/* Contact Section - Only AI Related */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Trasforma il Tuo Business con l'AI</h2>
              <p className="text-xl text-blue-200 mb-12">
                Scopri come l'Intelligenza Artificiale può rivoluzionare la tua azienda
              </p>

              <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-colors">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Soluzioni AI Personalizzate</h3>
                  </div>
                  <p className="text-blue-200 mb-6">
                    Dalla consulenza strategica agli AI Agent avanzati, trasformiamo le tue idee in soluzioni concrete
                  </p>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    onClick={() =>
                      window.open(
                        "https://wa.me/+393514206353?text=Ciao Luca, sono interessato alle tue soluzioni AI",
                        "_blank",
                      )
                    }
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Richiedi Consulenza AI
                  </Button>
                </div>
              </div>

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
                <p className="text-sm text-blue-300 mb-2">
                  © 2024 Luca Corrao. Tutti i diritti riservati. | Intelligenza Artificiale & Innovazione
                </p>
                <p className="text-xs text-blue-400">🚀 Bedda Tech - Il futuro dell'AI è qui</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
