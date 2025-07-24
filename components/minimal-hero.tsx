"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Bot, MessageCircle, Phone } from "lucide-react"
import Image from "next/image"
import { StructuresSection } from "./structures-section"
import { AISolutionsSection } from "./ai-solutions-section"
import { AIChat } from "./ai-chat"

export function MinimalHero() {
  const [activeSection, setActiveSection] = useState<"structures" | "ai" | null>(null)

  const closeSection = () => {
    setActiveSection(null)
  }

  if (activeSection === "structures") {
    return <StructuresSection onClose={closeSection} />
  }

  if (activeSection === "ai") {
    return <AISolutionsSection onClose={closeSection} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image */}
          <div className="mb-8">
            <Image
              src="/images/luca-corrao-profile.jpg"
              alt="Luca Corrao - Innovazione AI & Eccellenza nell'Ospitalità Siciliana"
              width={300}
              height={300}
              className="rounded-full mx-auto shadow-2xl object-cover border-8 border-white"
              priority
            />
          </div>

          {/* Name and Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Luca Corrao</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Innovazione AI & Eccellenza nell'Ospitalità Siciliana
          </p>

          {/* Main Action Buttons */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <Button
              size="lg"
              onClick={() => setActiveSection("structures")}
              className="h-20 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Building2 className="w-8 h-8 mr-3" />
              <div className="text-left">
                <div>Esplora le Strutture</div>
                <div className="text-sm opacity-90">Ospitalità di Eccellenza</div>
              </div>
            </Button>

            <Button
              size="lg"
              onClick={() => setActiveSection("ai")}
              className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Bot className="w-8 h-8 mr-3" />
              <div className="text-left">
                <div>Scopri le Soluzioni AI</div>
                <div className="text-sm opacity-90">Intelligenza Artificiale</div>
              </div>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="flex justify-center items-center gap-8 text-gray-600">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-green-600 flex items-center gap-2"
              onClick={() => window.open("https://wa.me/+393514206353", "_blank")}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              onClick={() => window.open("tel:+393513671340", "_blank")}
            >
              <Phone className="w-5 h-5" />
              Telefono
            </Button>
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <AIChat />
    </div>
  )
}
