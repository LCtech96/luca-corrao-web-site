"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Bot, MessageCircle, Phone } from "lucide-react"
import Image from "next/image"
import { StructuresSection } from "./structures-section"
import { AISolutionsSection } from "./ai-solutions-section"
import { AIChat } from "./ai-chat"
import { SocialMediaLinks } from "./social-media-links"
import { ProfileBanner } from "./profile-banner"
import { NavigationBar } from "./navigation-bar"

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
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Main Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 relative overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern-warm opacity-30"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-10 animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full opacity-10 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Profile Banner with Image */}
          <div className="mb-20">
            <ProfileBanner />
          </div>

          {/* Name and Title */}
          <div className="mb-20 mt-16">
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-wide">
              Luca Corrao
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-10 rounded-full"></div>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
              Innovazione AI & Eccellenza nell'Ospitalità Siciliana
            </p>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Trasformo l'ospitalità tradizionale con soluzioni AI all'avanguardia, 
              creando esperienze uniche e memorabili per i nostri ospiti
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-20">
            <Button
              size="lg"
              onClick={() => setActiveSection("structures")}
              className="h-28 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0 rounded-3xl btn-professional"
            >
              <Building2 className="w-12 h-12 mr-6" />
              <div className="text-left">
                <div className="text-2xl font-bold">Esplora le Strutture</div>
                <div className="text-sm opacity-90 font-normal">Ospitalità di Eccellenza</div>
              </div>
            </Button>

            <Button
              size="lg"
              onClick={() => setActiveSection("ai")}
              className="h-28 bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white text-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0 rounded-3xl btn-professional"
            >
              <Bot className="w-12 h-12 mr-6" />
              <div className="text-left">
                <div className="text-2xl font-bold">Scopri le Soluzioni AI</div>
                <div className="text-sm opacity-90 font-normal">Intelligenza Artificiale</div>
              </div>
            </Button>
          </div>

          {/* Social Media Links */}
          <SocialMediaLinks />
        </div>
      </section>

      {/* AI Chat Section */}
      <AIChat />
    </div>
  )
}
