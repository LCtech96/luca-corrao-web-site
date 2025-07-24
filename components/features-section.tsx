"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Code, Bot } from "lucide-react"
import { useState } from "react"
import { ConsultationForm } from "./consultation-form"
import { AIAgentDemos } from "./ai-agent-demos"

const features = [
  {
    id: "ai-vision",
    icon: Brain,
    title: "Visione AI & Sviluppo Software",
    subtitle: "Il Futuro è Ora",
    description:
      "Scopri come l'Intelligenza Artificiale sta plasmando le soluzioni di domani e la nostra expertise nello sviluppo software.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    url: "https://www.bedda.tech",
  },
  {
    id: "ai-agents",
    icon: Bot,
    title: "AI Agent Development",
    subtitle: "Agenti Intelligenti al Tuo Servizio",
    description:
      "La creazione di sistemi autonomi per ottimizzare il tuo business attraverso l'automazione intelligente.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    hasDemos: true,
  },
  {
    id: "strategic-consulting",
    icon: Code,
    title: "Consulenza Strategica AI",
    subtitle: "Trasformazione Digitale Avanzata",
    description: "Assistenza tecnica specializzata e integrazione AI per rivoluzionare digitalmente la tua azienda.",
    color: "text-green-600",
    bgColor: "bg-green-50",
    hasForm: true,
  },
]

export function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const handleFeatureClick = (feature: any) => {
    if (feature.url) {
      window.open(feature.url, "_blank")
    } else if (feature.hasForm || feature.hasDemos) {
      setSelectedFeature(feature.id)
    }
  }

  const handleCloseModal = () => {
    setSelectedFeature(null)
  }

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Soluzioni AI Avanzate</h2>
          <p className="text-xl text-gray-600">
            Clicca su ogni sezione per approfondire e scoprire come l'AI può trasformare il tuo business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
              onClick={() => handleFeatureClick(feature)}
            >
              <CardHeader className={`${feature.bgColor} rounded-t-lg`}>
                <div className={`w-12 h-12 ${feature.color} mb-4`}>
                  <feature.icon className="w-full h-full" />
                </div>
                <CardTitle className="text-xl text-gray-900 group-hover:text-gray-700">{feature.title}</CardTitle>
                <p className={`text-sm font-medium ${feature.color}`}>{feature.subtitle}</p>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full border-current ${feature.color} hover:bg-current hover:text-white`}
                >
                  {feature.url
                    ? "Visita il Sito"
                    : feature.hasForm
                      ? "Richiedi Consulenza"
                      : feature.hasDemos
                        ? "Vedi Demo AI"
                        : "Scopri di Più"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consultation Form Modal */}
        {selectedFeature === "strategic-consulting" && <ConsultationForm onClose={handleCloseModal} />}

        {/* AI Agent Demos Modal */}
        {selectedFeature === "ai-agents" && <AIAgentDemos onClose={handleCloseModal} />}
      </div>
    </section>
  )
}
