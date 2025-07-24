"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, MessageCircle, Phone } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/terrasini-sunset.jpg"
          alt="Tramonto a Terrasini - Sicilia, vista dalle strutture ricettive Lucas Suite e Lucas Rooftop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-blue-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="mb-8">
          <Image
            src="/images/luca-corrao-profile.jpg"
            alt="Luca Corrao - Esperto in Intelligenza Artificiale e Imprenditore nell'Ospitalità Siciliana"
            width={200}
            height={200}
            className="rounded-full mx-auto mb-6 border-4 border-white/20 shadow-2xl object-cover"
          />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block text-blue-300">Luca Corrao</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl font-light mt-2 text-gray-200">
            Innovazione AI & Eccellenza nell'Ospitalità Siciliana
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-300 leading-relaxed">
          Dove l'Intelligenza Artificiale incontra l'accoglienza autentica della Sicilia
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            onClick={() => scrollToSection("features")}
          >
            Scopri le Soluzioni AI
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg bg-transparent"
            onClick={() => scrollToSection("accommodations")}
          >
            Esplora le Strutture
          </Button>
        </div>

        <div className="flex justify-center items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-blue-300 flex items-center gap-2"
            onClick={() => window.open("https://wa.me/+393514206353", "_blank")}
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-blue-300 flex items-center gap-2"
            onClick={() => window.open("tel:+393513671340", "_blank")}
          >
            <Phone className="w-5 h-5" />
            Chiama Ora
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-8 h-8 text-white/70" />
        </div>
      </div>
    </section>
  )
}
