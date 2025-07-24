"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

interface AIAgentDemosProps {
  onClose: () => void
}

const aiAgents = [
  {
    id: "receptionist",
    name: "AI Receptionist",
    icon: Phone,
    description: "Assistente virtuale per reception e customer service 24/7",
    industry: "Hospitality, Healthcare, Business",
    features: ["Risposta automatica", "Gestione appuntamenti", "Trasferimento chiamate", "Multilingua"],
    color: "bg-blue-50 text-blue-600 border-blue-200",
    demo: {
      title: "Demo AI Receptionist",
      scenario: "Hotel Lucas Suite - Reception Virtuale",
      conversation: [
        { speaker: "Cliente", message: "Buongiorno, vorrei prenotare una camera per questo weekend." },
        {
          speaker: "AI",
          message:
            "Buongiorno! Sarò felice di aiutarla. Per questo weekend abbiamo disponibilità sia per Lucas Suite che Lucas Rooftop. Quante persone sarete?",
        },
        { speaker: "Cliente", message: "Siamo in due, preferiremmo una camera romantica." },
        {
          speaker: "AI",
          message:
            "Perfetto! Le consiglio Lucas Suite con i suoi splendidi affreschi storici. La camera è a 30m da Piazza Duomo e 350m dal mare. Posso procedere con la prenotazione?",
        },
      ],
    },
  },
  {
    id: "concierge",
    name: "AI Concierge",
    icon: Building,
    description: "Assistente personale per servizi di concierge e raccomandazioni",
    industry: "Hotels, Luxury Services",
    features: ["Raccomandazioni locali", "Prenotazioni ristoranti", "Itinerari personalizzati", "Servizi premium"],
    color: "bg-purple-50 text-purple-600 border-purple-200",
    demo: {
      title: "Demo AI Concierge",
      scenario: "Servizio Concierge Personalizzato",
      conversation: [
        { speaker: "Ospite", message: "Dove posso cenare stasera con vista mare?" },
        {
          speaker: "AI",
          message:
            "Le consiglio 3 ristoranti eccellenti: 'Il Baglio' con terrazza sul mare (5 min a piedi), 'La Baia' specialità pesce (10 min), o 'Sunset Terrace' per un'esperienza romantica. Preferisce che prenoti?",
        },
        { speaker: "Ospite", message: "Sunset Terrace sembra perfetto!" },
        {
          speaker: "AI",
          message:
            "Ottima scelta! Ho prenotato per 2 persone alle 20:00. Ho anche organizzato il transfer gratuito. Riceverà conferma via WhatsApp con tutti i dettagli.",
        },
      ],
    },
  },
  {
    id: "booking-assistant",
    name: "AI Booking Assistant",
    icon: Calendar,
    description: "Assistente per prenotazioni con interfaccia vocale e visiva",
    industry: "Travel, Automotive, Services",
    features: ["Prenotazioni vocali", "Calendario integrato", "Pagamenti automatici", "Conferme istantanee"],
    color: "bg-green-50 text-green-600 border-green-200",
    demo: {
      title: "Demo AI Booking Assistant",
      scenario: "Prenotazione Auto con Assistente Vocale",
      conversation: [
        { speaker: "Cliente", message: "🎤 Vorrei noleggiare un'auto per domani mattina" },
        {
          speaker: "AI",
          message:
            "🚗 Perfetto! Ho trovato 3 opzioni disponibili: Fiat 500 (€35/giorno), Volkswagen Golf (€45/giorno), BMW Serie 1 (€65/giorno). Quale preferisce?",
        },
        { speaker: "Cliente", message: "🎤 La Golf va bene" },
        {
          speaker: "AI",
          message:
            "✅ Volkswagen Golf prenotata per domani dalle 9:00. Ritiro presso Lucas Suite con sconto del 10% (€40,50/giorno). Procedo con il pagamento?",
        },
      ],
    },
  },
  {
    id: "lead-generator",
    name: "AI Lead Generator",
    icon: TrendingUp,
    description: "Sistema intelligente per generazione e qualificazione lead",
    industry: "Sales, Marketing, B2B",
    features: ["Qualificazione automatica", "Scoring lead", "Follow-up intelligente", "CRM integration"],
    color: "bg-orange-50 text-orange-600 border-orange-200",
    demo: {
      title: "Demo AI Lead Generator",
      scenario: "Qualificazione Lead per Servizi AI",
      conversation: [
        { speaker: "Prospect", message: "Sono interessato ai vostri servizi di intelligenza artificiale" },
        {
          speaker: "AI",
          message:
            "Fantastico! Per proporle la soluzione più adatta, può dirmi: che tipo di business gestisce e qual è la sua principale sfida operativa?",
        },
        {
          speaker: "Prospect",
          message: "Ho un e-commerce di abbigliamento, faccio fatica a gestire il customer service",
        },
        {
          speaker: "AI",
          message:
            "Capisco perfettamente. Per e-commerce come il suo, un AI Customer Service può ridurre i tempi di risposta del 90%. Le invio subito un case study simile al suo e programmiamo una demo personalizzata?",
        },
      ],
    },
  },
  {
    id: "outreach",
    name: "AI Outreach",
    icon: Mail,
    description: "Automazione intelligente per campagne di outreach personalizzate",
    industry: "Sales, Marketing, Recruitment",
    features: ["Messaggi personalizzati", "Follow-up automatico", "A/B testing", "Analytics avanzate"],
    color: "bg-red-50 text-red-600 border-red-200",
    demo: {
      title: "Demo AI Outreach",
      scenario: "Campagna Email Personalizzata",
      conversation: [
        {
          speaker: "AI System",
          message: "📧 Analizzando il profilo LinkedIn di Marco Rossi (CEO, TechStart Milano)...",
        },
        {
          speaker: "AI",
          message:
            "✍️ Email generata: 'Ciao Marco, ho visto che TechStart ha recentemente lanciato la nuova app. Complimenti! Ho notato che potreste beneficiare di un AI chatbot per supporto clienti. Posso mostrarvi come abbiamo aiutato startup simili?'",
        },
        {
          speaker: "System",
          message: "📊 Email inviata. Tasso di apertura: 67% | Click rate: 23% | Risposta ricevuta in 2 ore",
        },
        {
          speaker: "AI",
          message:
            "🎯 Lead qualificato! Marco ha mostrato interesse. Programmo follow-up personalizzato e notifico il team sales.",
        },
      ],
    },
  },
  {
    id: "personal-assistant",
    name: "AI Personal Assistant",
    icon: User,
    description: "Assistente personale intelligente per gestione quotidiana",
    industry: "Executive, Professionals, Personal",
    features: ["Gestione calendario", "Email intelligenti", "Promemoria smart", "Analisi produttività"],
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    demo: {
      title: "Demo AI Personal Assistant",
      scenario: "Gestione Giornata Lavorativa",
      conversation: [
        { speaker: "Utente", message: "Come è messa la mia giornata oggi?" },
        {
          speaker: "AI",
          message:
            "📅 Oggi hai 4 meeting: 9:00 Team standup, 11:00 Cliente Rossi (preparato brief), 14:30 Demo AI (slides pronte), 16:00 Review progetto. 📧 3 email urgenti da rispondere. ☀️ Meteo: sole, perfetto per il meeting all'aperto delle 14:30.",
        },
        { speaker: "Utente", message: "Sposta il meeting delle 16:00 a domani" },
        {
          speaker: "AI",
          message:
            "✅ Meeting spostato a domani 16:00. Ho già inviato email ai partecipanti con le scuse e nuova data. Ti libero un'ora per completare il report trimestrale che scade venerdì.",
        },
      ],
    },
  },
  {
    id: "customer-support",
    name: "AI Customer Support",
    icon: Headphones,
    description: "Supporto clienti intelligente multicanale 24/7",
    industry: "E-commerce, SaaS, Services",
    features: ["Chat multilingua", "Risoluzione automatica", "Escalation intelligente", "Knowledge base"],
    color: "bg-teal-50 text-teal-600 border-teal-200",
    demo: {
      title: "Demo AI Customer Support",
      scenario: "E-commerce - Supporto Post-Vendita",
      conversation: [
        { speaker: "Cliente", message: "Il mio ordine #12345 non è ancora arrivato" },
        {
          speaker: "AI",
          message:
            "Mi dispiace per il disagio! Ho controllato il tuo ordine #12345: è in transito e arriverà domani entro le 18:00. Ecco il tracking: TR789456123. Vuoi che imposti un promemoria per il monitoraggio?",
        },
        { speaker: "Cliente", message: "Sì grazie, e se non arriva?" },
        {
          speaker: "AI",
          message:
            "Se non dovesse arrivare entro domani sera, ti contatterò automaticamente per organizzare una spedizione express gratuita o un rimborso completo. Hai anche diritto a uno sconto del 15% sul prossimo ordine per l'inconveniente.",
        },
      ],
    },
  },
  {
    id: "sales-assistant",
    name: "AI Sales Assistant",
    icon: ShoppingCart,
    description: "Assistente vendite per e-commerce e retail",
    industry: "Retail, E-commerce, Fashion",
    features: ["Raccomandazioni prodotti", "Cross-selling", "Carrello intelligente", "Analisi comportamento"],
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    demo: {
      title: "Demo AI Sales Assistant",
      scenario: "E-commerce Moda - Consulenza Personalizzata",
      conversation: [
        { speaker: "Cliente", message: "Cerco un vestito elegante per una cerimonia" },
        {
          speaker: "AI",
          message:
            "Perfetto! Basandomi sui tuoi acquisti precedenti (ami lo stile classico) e la stagione, ti consiglio: Vestito blu navy Armani (€299), Abito nero Zara (€89), o Vestito floreale H&M (€49). Che tipo di cerimonia è?",
        },
        { speaker: "Cliente", message: "Un matrimonio di sera" },
        {
          speaker: "AI",
          message:
            "Per un matrimonio serale, l'Armani blu navy è perfetto! Ti suggerisco anche: scarpe nude Louboutin (€89), clutch dorata (€35) e scialle in seta (€25). Totale look: €448. Vuoi vedere come sta insieme?",
        },
      ],
    },
  },
]

export function AIAgentDemos({ onClose }: AIAgentDemosProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const selectedAgentData = aiAgents.find((agent) => agent.id === selectedAgent)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900">AI Agent Development - Demo Interattive</CardTitle>
              <p className="text-gray-600 mt-2">Esplora i nostri agenti intelligenti in azione</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {!selectedAgent ? (
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {aiAgents.map((agent) => (
                  <Card
                    key={agent.id}
                    className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${agent.color} hover:scale-105`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center`}>
                          <agent.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          <p className="text-xs text-gray-500">{agent.industry}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {agent.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">🚀 Perché Scegliere i Nostri AI Agent?</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-800">⚡ Implementazione Rapida</h4>
                    <p className="text-blue-700">Deploy in 2-4 settimane con integrazione completa</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">🎯 Personalizzazione Totale</h4>
                    <p className="text-blue-700">Adattati al 100% al tuo business e brand</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">📈 ROI Garantito</h4>
                    <p className="text-blue-700">Riduzione costi del 60% e aumento efficienza del 300%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            selectedAgentData && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="outline" onClick={() => setSelectedAgent(null)}>
                    ← Torna alla Lista
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${selectedAgentData.color} flex items-center justify-center`}>
                      <selectedAgentData.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedAgentData.demo.title}</h2>
                      <p className="text-gray-600">{selectedAgentData.demo.scenario}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">💬 Conversazione Demo</h3>
                  <div className="space-y-4">
                    {selectedAgentData.demo.conversation.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.speaker === "AI" || message.speaker === "AI System" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            message.speaker === "AI" || message.speaker === "AI System"
                              ? "bg-indigo-600 text-white rounded-bl-sm"
                              : message.speaker === "System"
                                ? "bg-gray-600 text-white rounded-lg"
                                : "bg-white text-gray-900 border border-gray-200 rounded-br-sm"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium opacity-75">
                              {message.speaker === "AI System"
                                ? "🤖 Sistema"
                                : message.speaker === "AI"
                                  ? "🤖 AI"
                                  : message.speaker === "System"
                                    ? "⚙️ Sistema"
                                    : "👤 " + message.speaker}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">🎯 Caratteristiche Principali</h4>
                    <div className="space-y-2">
                      {selectedAgentData.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">💼 Settori di Applicazione</h4>
                    <p className="text-sm text-green-800 mb-3">{selectedAgentData.industry}</p>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const message = `Ciao Luca! Sono interessato al ${selectedAgentData.name}. Vorrei saperne di più su come potrebbe aiutare il mio business.`
                        window.open(`https://wa.me/+393514206353?text=${encodeURIComponent(message)}`, "_blank")
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Richiedi Demo Personalizzata
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}
