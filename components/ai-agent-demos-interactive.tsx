"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  X,
  Phone,
  Calendar,
  TrendingUp,
  Mail,
  User,
  MessageCircle,
  Headphones,
  ShoppingCart,
  Building,
  ArrowLeft,
  Send,
  Loader2,
  Bot,
  ExternalLink,
} from "lucide-react"
import { AI_AGENT_PROMPTS, type AIAgentId } from "@/lib/ai-agents-prompts"

interface AIAgentDemosInteractiveProps {
  onClose: () => void
}

interface Message {
  role: "user" | "assistant"
  content: string
}

const aiAgents = [
  {
    id: "receptionist" as AIAgentId,
    name: "AI Receptionist",
    icon: Phone,
    description: "Assistente virtuale per reception e customer service 24/7",
    industry: "Hospitality, Healthcare, Business",
    features: ["Risposta automatica", "Gestione appuntamenti", "Trasferimento chiamate", "Multilingua"],
    color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "concierge" as AIAgentId,
    name: "AI Concierge",
    icon: Building,
    description: "Assistente personale per servizi di concierge e raccomandazioni",
    industry: "Hotels, Luxury Services",
    features: ["Raccomandazioni locali", "Prenotazioni ristoranti", "Itinerari personalizzati", "Servizi premium"],
    color: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "booking-assistant" as AIAgentId,
    name: "AI Booking Assistant",
    icon: Calendar,
    description: "Assistente per prenotazioni con interfaccia vocale e visiva",
    industry: "Travel, Automotive, Services",
    features: ["Prenotazioni vocali", "Calendario integrato", "Pagamenti automatici", "Conferme istantanee"],
    color: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
    bgColor: "bg-green-50 dark:bg-green-950",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "lead-generator" as AIAgentId,
    name: "AI Lead Generator",
    icon: TrendingUp,
    description: "Sistema intelligente per generazione e qualificazione lead",
    industry: "Sales, Marketing, B2B",
    features: ["Qualificazione automatica", "Scoring lead", "Follow-up intelligente", "CRM integration"],
    color: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "outreach" as AIAgentId,
    name: "AI Outreach",
    icon: Mail,
    description: "Automazione intelligente per campagne di outreach personalizzate",
    industry: "Sales, Marketing, Recruitment",
    features: ["Messaggi personalizzati", "Follow-up automatico", "A/B testing", "Analytics avanzate"],
    color: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    bgColor: "bg-red-50 dark:bg-red-950",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    id: "personal-assistant" as AIAgentId,
    name: "AI Personal Assistant",
    icon: User,
    description: "Assistente personale intelligente per gestione quotidiana",
    industry: "Executive, Professionals, Personal",
    features: ["Gestione calendario", "Email intelligenti", "Promemoria smart", "Analisi produttività"],
    color: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "customer-support" as AIAgentId,
    name: "AI Customer Support",
    icon: Headphones,
    description: "Supporto clienti intelligente multicanale 24/7",
    industry: "E-commerce, SaaS, Services",
    features: ["Chat multilingua", "Risoluzione automatica", "Escalation intelligente", "Knowledge base"],
    color: "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    bgColor: "bg-teal-50 dark:bg-teal-950",
    textColor: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "sales-assistant" as AIAgentId,
    name: "AI Sales Assistant",
    icon: ShoppingCart,
    description: "Assistente vendite per e-commerce e retail",
    industry: "Retail, E-commerce, Fashion",
    features: ["Raccomandazioni prodotti", "Cross-selling", "Carrello intelligente", "Analisi comportamento"],
    color: "bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
]

export function AIAgentDemosInteractive({ onClose }: AIAgentDemosInteractiveProps) {
  const [selectedAgent, setSelectedAgent] = useState<AIAgentId | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedAgentData = aiAgents.find((agent) => agent.id === selectedAgent)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedAgent && messages.length === 0) {
      // Messaggio iniziale dell'AI quando selezioni un agente
      setMessages([
        {
          role: "assistant",
          content:
            "Ciao! Sono pronto a mostrarti come posso trasformare il tuo business. Iniziamo con alcune domande per capire meglio le tue esigenze...",
        },
      ])
    }
  }, [selectedAgent])

  useEffect(() => {
    // Focus input quando apri la chat
    if (selectedAgent) {
      inputRef.current?.focus()
    }
  }, [selectedAgent])

  const handleSelectAgent = (agentId: AIAgentId) => {
    setSelectedAgent(agentId)
    setMessages([])
    setInput("")
  }

  const handleBackToList = () => {
    setSelectedAgent(null)
    setMessages([])
    setInput("")
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAgent || isLoading) return

    const userMessage = input.trim()
    setInput("")

    // Aggiungi messaggio utente
    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Chiamata API con sistema prompt specifico per l'agente
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: AI_AGENT_PROMPTS[selectedAgent],
            },
            ...newMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Errore nella risposta dell'API")
      }

      const data = await response.json()

      // Aggiungi risposta AI
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.response || "Mi dispiace, non ho capito. Puoi riformulare?",
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Mi dispiace, si è verificato un errore. Riprova tra qualche secondo.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleWhatsAppContact = () => {
    // Prepara il messaggio per WhatsApp con l'intera conversazione
    const agentName = selectedAgentData?.name || "AI Agent"
    let whatsappMessage = `Ciao Luca! Ho chattato con il ${agentName} e vorrei saperne di più.\n\n`
    
    // Aggiungi le ultime 4-5 interazioni più rilevanti
    const recentMessages = messages.slice(-6)
    whatsappMessage += "Ecco un riassunto della conversazione:\n\n"
    
    recentMessages.forEach((msg) => {
      const speaker = msg.role === "assistant" ? "AI" : "Io"
      whatsappMessage += `${speaker}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? "..." : ""}\n\n`
    })
    
    whatsappMessage += "Vorrei ricevere maggiori informazioni e un preventivo personalizzato.\nGrazie!"
    
    const phoneNumber = "+393514206353"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedAgent && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-800/50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Indietro
                  </Button>
                  {messages.length > 2 && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleWhatsAppContact}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contatta Luca
                    </Button>
                  )}
                </>
              )}
              <div>
                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                  {selectedAgent ? selectedAgentData?.name : "AI Agent Development - Demo Interattive"}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {selectedAgent
                    ? "Chatta con l'agente per scoprire come può aiutarti"
                    : "Esplora i nostri agenti intelligenti in azione"}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          {!selectedAgent ? (
            <div className="p-6 overflow-y-auto h-full">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {aiAgents.map((agent) => (
                  <Card
                    key={agent.id}
                    className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${agent.color} hover:scale-105`}
                    onClick={() => handleSelectAgent(agent.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${agent.bgColor} flex items-center justify-center`}>
                          <agent.icon className={`w-5 h-5 ${agent.textColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{agent.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{agent.industry}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{agent.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs dark:border-gray-700">
                            {feature}
                          </Badge>
                        ))}
                        {agent.features.length > 2 && (
                          <Badge variant="outline" className="text-xs dark:border-gray-700">
                            +{agent.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  🚀 Perché Scegliere i Nostri AI Agent?
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">⚡ Implementazione Rapida</h4>
                    <p className="text-blue-700 dark:text-blue-300">
                      Deploy in 2-4 settimane con integrazione completa
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">🎯 Personalizzazione Totale</h4>
                    <p className="text-blue-700 dark:text-blue-300">Adattati al 100% al tuo business e brand</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">📈 ROI Garantito</h4>
                    <p className="text-blue-700 dark:text-blue-300">
                      Riduzione costi del 60% e aumento efficienza del 300%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] lg:max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.role === "assistant"
                          ? "bg-indigo-600 dark:bg-indigo-500 text-white rounded-bl-sm"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-br-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === "assistant" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span className="text-xs font-medium opacity-75">
                          {message.role === "assistant" ? "AI Agent" : "Tu"}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-3 rounded-2xl rounded-bl-sm">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Scrivi un messaggio..."
                    disabled={isLoading}
                    className="flex-1 bg-gray-50 dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Questa è una demo interattiva. L'AI risponderà basandosi sul ruolo dell'agente selezionato.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

