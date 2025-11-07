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
import { Snowfall3D } from "./snowfall-3d"

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
      <section className="flex-1 flex items-center justify-center px-4 relative overflow-hidden pt-20">
        {/* Snowboarding HD Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/snowboarding-slope-hd.jpg"
            alt="Snowboarding Slope"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* 3D Snowfall Effect - Slow Motion */}
        <Snowfall3D />
        
        <div className="max-w-6xl mx-auto text-center relative z-30">
          {/* Profile Banner with Image */}
          <div className="mb-20">
            <ProfileBanner />
          </div>

          {/* Name and Title */}
          <div className="mb-20 mt-16">
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-wide drop-shadow-2xl">
              Luca Corrao
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-10 rounded-full shadow-lg shadow-cyan-500/50"></div>
            <p className="text-xl md:text-2xl text-white mb-6 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
              Innovazione AI & Eccellenza nell'Ospitalità Siciliana
            </p>
            <p className="text-base md:text-lg text-gray-100 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
              Trasformo l'ospitalità tradizionale con soluzioni AI all'avanguardia, 
              creando esperienze uniche e memorabili per i nostri ospiti
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-20">
            <Button
              size="lg"
              onClick={() => setActiveSection("structures")}
              className="h-28 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-2xl font-bold shadow-2xl shadow-cyan-500/50 hover:shadow-3xl hover:shadow-cyan-600/60 transform hover:scale-105 transition-all duration-300 border-0 rounded-3xl btn-professional backdrop-blur-sm"
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
              className="h-28 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white text-2xl font-bold shadow-2xl shadow-indigo-500/50 hover:shadow-3xl hover:shadow-indigo-600/60 transform hover:scale-105 transition-all duration-300 border-0 rounded-3xl btn-professional backdrop-blur-sm"
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
