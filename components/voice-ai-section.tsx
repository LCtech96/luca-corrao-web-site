"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Volume2,
  Zap,
  Crown,
  Rocket,
  Check,
  X,
  MessageCircle,
  Play,
  Pause,
  Users,
  Globe,
  Clock,
  Star,
} from "lucide-react"
import { PaymentForm } from "./payment-form"

interface VoiceAISectionProps {
  onClose?: () => void
}

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "€5.50",
    originalPrice: "€5.00",
    period: "/mese",
    description: "Perfetto per iniziare con l'AI vocale",
    features: ["10.000 caratteri/mese", "3 voci premium", "Qualità standard", "Supporto email", "API base"],
    limitations: ["Watermark audio", "Uso commerciale limitato"],
    icon: Mic,
    color: "bg-blue-50 border-blue-200 text-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    popular: false,
  },
  {
    id: "creator",
    name: "Creator",
    price: "€24.20",
    originalPrice: "€22.00",
    period: "/mese",
    description: "Per creator e piccole aziende",
    features: [
      "100.000 caratteri/mese",
      "Tutte le voci premium",
      "Qualità HD",
      "Clonazione vocale (1 voce)",
      "API completa",
      "Supporto prioritario",
    ],
    limitations: [],
    icon: Volume2,
    color: "bg-purple-50 border-purple-200 text-purple-600",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "€110.00",
    originalPrice: "€100.00",
    period: "/mese",
    description: "Per professionisti e team",
    features: [
      "500.000 caratteri/mese",
      "Voci illimitate",
      "Qualità Ultra HD",
      "Clonazione vocale (10 voci)",
      "Editor audio avanzato",
      "Integrazione WhatsApp",
      "Analytics dettagliati",
    ],
    limitations: [],
    icon: Zap,
    color: "bg-green-50 border-green-200 text-green-600",
    buttonColor: "bg-green-600 hover:bg-green-700",
    popular: false,
  },
  {
    id: "scale",
    name: "Scale",
    price: "€363.00",
    originalPrice: "€330.00",
    period: "/mese",
    description: "Per grandi aziende",
    features: [
      "2.000.000 caratteri/mese",
      "Voci personalizzate illimitate",
      "Qualità Studio",
      "Clonazione vocale professionale",
      "White-label completo",
      "Supporto dedicato 24/7",
      "SLA garantito",
      "Integrazione enterprise",
    ],
    limitations: [],
    icon: Crown,
    color: "bg-amber-50 border-amber-200 text-amber-600",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    popular: false,
  },
]

const voiceFeatures = [
  {
    icon: Globe,
    title: "Multilingua",
    description: "Oltre 29 lingue supportate con accenti nativi",
  },
  {
    icon: Users,
    title: "Clonazione Vocale",
    description: "Crea voci personalizzate identiche alla realtà",
  },
  {
    icon: Clock,
    title: "Tempo Reale",
    description: "Generazione audio istantanea per conversazioni live",
  },
  {
    icon: Star,
    title: "Qualità Studio",
    description: "Audio professionale indistinguibile dalla voce umana",
  },
]

export function VoiceAISection({ onClose }: VoiceAISectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)

  const demoTexts = [
    "Benvenuto nel futuro dell'intelligenza artificiale vocale. La tua voce, amplificata dalla tecnologia.",
    "Crea assistenti vocali che parlano come te, con la tua personalità e il tuo stile unico.",
    "Trasforma il tuo business con AI Agent che non dormono mai e parlano in modo naturale.",
  ]

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan)
  }

  const toggleDemo = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control actual audio playback
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Agent Vocale
              </h2>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Crea il tuo assistente vocale personalizzato con intelligenza artificiale avanzata. Voci realistiche,
              conversazioni naturali, risultati straordinari.
            </p>

            {/* Demo Player */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">🎧 Ascolta una Demo</h3>
                <Button
                  onClick={toggleDemo}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 rounded-full w-12 h-12 p-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-gray-300 text-sm italic">"{demoTexts[currentDemo]}"</p>
              <div className="flex justify-center gap-2 mt-4">
                {demoTexts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDemo(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentDemo ? "bg-purple-400" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {voiceFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Scegli il Tuo Piano</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-purple-400 scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Più Popolare
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${plan.color}`}
                    >
                      <plan.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-sm font-normal text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-300">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="text-sm text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <Button onClick={() => handlePlanSelect(plan)} className={`w-full ${plan.buttonColor} text-white`}>
                      Sottoscrivi Ora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Casi d'Uso Rivoluzionari</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Customer Service 24/7</h4>
                <p className="text-sm text-gray-300">
                  Assistenti vocali che rispondono ai clienti con la tua voce, sempre disponibili
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Marketing Personalizzato</h4>
                <p className="text-sm text-gray-300">
                  Campagne vocali che parlano direttamente al cuore dei tuoi clienti
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Formazione Aziendale</h4>
                <p className="text-sm text-gray-300">Corsi e tutorial con voci realistiche che coinvolgono e formano</p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Pronto a Rivoluzionare il Tuo Business?</h3>
              <p className="text-lg text-purple-100 mb-6">
                Unisciti a migliaia di aziende che hanno già trasformato la loro comunicazione con l'AI vocale
              </p>
              <Button
                size="lg"
                onClick={() =>
                  window.open(
                    "https://wa.me/+393514206353?text=🎤 Voglio creare il mio AI Agent vocale! Quando possiamo iniziare?",
                    "_blank",
                  )
                }
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Inizia la Tua Trasformazione Vocale
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {selectedPlan && <PaymentForm plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}
    </section>
  )
}
