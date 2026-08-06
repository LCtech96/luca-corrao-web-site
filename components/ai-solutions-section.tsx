"use client"

import { Button } from "@/components/ui/button"
import { X, ArrowLeft, MessageCircle, Phone, Mail, Bot } from "lucide-react"
import { AboutSection } from "./about-section"
import { FeaturesSection } from "./features-section"
import { VoiceAISection } from "./voice-ai-section"
import { LanguageSelector } from "./language-selector"
import { SiteFooter } from "./site-footer"
import { useTranslation } from "@/lib/i18n"

interface AISolutionsSectionProps {
  onClose: () => void
}

export function AISolutionsSection({ onClose }: AISolutionsSectionProps) {
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950">
      {/* Header with Back Button - Tema Scuro */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-cyan-500/30 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{t.aiSolutions.backHome}</span>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {t.aiSolutions.title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <LanguageSelector compact />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-8">
        <AboutSection />
        <FeaturesSection />
        <VoiceAISection />

        {/* Contact Section - Tema Scuro Moderno */}
        <section className="py-20 bg-gradient-to-br from-cyan-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm text-white border-t border-cyan-500/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.aiSolutions.transformTitle}</h2>
              <p className="text-xl text-blue-200 mb-12">
                {t.aiSolutions.transformSubtitle}
              </p>

              <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-colors">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{t.aiSolutions.customTitle}</h3>
                  </div>
                  <p className="text-blue-200 mb-6">
                    {t.aiSolutions.customDesc}
                  </p>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    onClick={() =>
                      window.open(
                        `https://wa.me/+393514206353?text=${encodeURIComponent(t.aiSolutions.whatsappMessage)}`,
                        "_blank",
                      )
                    }
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t.aiSolutions.requestConsulting}
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">{t.common.whatsapp}</h4>
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
                  <h4 className="font-semibold mb-2">{t.common.phone}</h4>
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
                  <h4 className="font-semibold mb-2">{t.common.email}</h4>
                  <Button
                    variant="link"
                    className="text-purple-400 hover:text-purple-300 p-0"
                    onClick={() => window.open("mailto:lucacorrao1996@gmail.com", "_blank")}
                  >
                    lucacorrao1996@gmail.com
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter variant="ai" className="bg-transparent border-cyan-500/20" />
      </div>
    </div>
  )
}
