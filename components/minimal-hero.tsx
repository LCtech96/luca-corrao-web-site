"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Building2, Bot, MessageCircle, Phone } from "lucide-react"
import Image from "next/image"
import { StructuresSection } from "./structures-section"
import { AISolutionsSection } from "./ai-solutions-section"
import { NavigationBar } from "./navigation-bar"
import { Snowfall3D } from "./snowfall-3d"
import { SocialLinksCompact } from "./social-links-compact"
import { ChatBubble } from "./chat-bubble"

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
      <section className="flex-1 flex items-center justify-center px-4 relative overflow-hidden pt-16">
        {/* 4K Video Background - Extreme Skiing Action Sports */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/ski-extreme-4k.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>
        
        {/* 3D Snowfall Effect - Slow Motion */}
        <Snowfall3D />
        
        <div className="max-w-6xl mx-auto text-center relative z-30">
          {/* Profile Image + Nome + Social - COMPATTO */}
          <div className="mb-8">
            <div className="relative inline-block">
              {/* Red Bull Style Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 rounded-full blur-3xl opacity-40 animate-pulse-glow"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-2xl opacity-30 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
              <Image
                src="/images/luca-corrao-profile.jpg"
                alt="Luca Corrao"
                width={200}
                height={200}
                className="relative rounded-full shadow-2xl object-cover border border-red-500/80 backdrop-blur-sm hover:scale-105 hover:border-cyan-400 transition-all duration-500"
                priority
              />
          </div>

            {/* Nome vicino alla foto */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 tracking-wide drop-shadow-2xl">
              Luca Corrao
            </h1>
            
            {/* Social Links Compatti */}
            <SocialLinksCompact />
          </div>

          {/* Main Action Buttons - Red Bull Style */}
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-20">
            <Button
              size="lg"
              onClick={() => setActiveSection("structures")}
              className="h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white text-2xl font-black shadow-2xl shadow-amber-500/60 hover:shadow-[0_0_40px_rgba(251,146,60,0.8)] transform hover:scale-110 transition-all duration-300 border-2 border-amber-300/30 rounded-2xl uppercase tracking-wide"
            >
              <Building2 className="w-14 h-14 mr-6" />
              <div className="text-left">
                <div className="text-2xl font-black">Esplora le Strutture</div>
                <div className="text-sm opacity-95 font-semibold">Ospitalità di Eccellenza</div>
              </div>
            </Button>

            <Button
              size="lg"
              onClick={() => setActiveSection("ai")}
              className="h-32 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-600 hover:via-blue-700 hover:to-cyan-600 text-white text-2xl font-black shadow-2xl shadow-cyan-500/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] transform hover:scale-110 transition-all duration-300 border-2 border-cyan-300/30 rounded-2xl uppercase tracking-wide"
            >
              <Bot className="w-14 h-14 mr-6" />
              <div className="text-left">
                <div className="text-2xl font-black">Scopri le Soluzioni AI</div>
                <div className="text-sm opacity-95 font-semibold">Intelligenza Artificiale</div>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Chat Bubble - Always visible */}
      <ChatBubble />
    </div>
  )
}
