"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, Bot, User, Calendar, Sparkles, Volume2, VolumeX } from "lucide-react"
import { VoiceBookingAssistant } from "./voice-booking-assistant"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🌟 Benvenuto! Sono l'AI di Luca Corrao e posso guidarti attraverso le sue creazioni. Vuoi scoprire le strutture ricettive esclusive, gli AI Agent che trasformano i business, o hai domande specifiche? Dimmi, cosa ti incuriosisce di più?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true)
  const [showVoiceBooking, setShowVoiceBooking] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesisRef.current = window.speechSynthesis
    }
  }, [])

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current || !autoPlayEnabled) return

    // Stop any current speech
    speechSynthesisRef.current.cancel()

    // Clean text for speech (remove emojis and special characters)
    const cleanText = text
      .replace(/[🌟🚀🏛️🏖️🎨💊🧺🛒✈️🌅🐕💰📋🎯👤🤖⚡📱💡✅🔥]/gu, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/•/g, "")
      .trim()

    if (cleanText.length === 0) return

    const utterance = new SpeechSynthesisUtterance(cleanText)

    // Configure voice settings
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 0.8
    utterance.lang = "it-IT"

    // Try to use an Italian voice if available
    const voices = speechSynthesisRef.current.getVoices()
    const italianVoice = voices.find((voice) => voice.lang.startsWith("it"))
    if (italianVoice) {
      utterance.voice = italianVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesisRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    // Check if user wants to book
    const bookingKeywords = ["prenotare", "prenota", "prenotazione", "camera", "struttura", "soggiorno", "booking"]
    const isBookingRequest = bookingKeywords.some((keyword) => currentInput.toLowerCase().includes(keyword))

    if (isBookingRequest) {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "🏨 Perfetto! Ti apro subito l'assistente vocale per prenotazioni. Ti guiderò passo dopo passo per trovare la struttura perfetta e completare la prenotazione con comandi vocali. È molto più semplice e veloce!",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)

      if (autoPlayEnabled) {
        setTimeout(() => speakText(aiResponse.text), 500)
      }

      // Open voice booking assistant after a short delay
      setTimeout(() => {
        setShowVoiceBooking(true)
      }, 2000)

      return
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: messages.length + 2,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])

      // Auto-play the AI response
      if (autoPlayEnabled) {
        setTimeout(() => speakText(data.response), 500)
      }
    } catch (error) {
      console.error("Error calling chat API:", error)
      const fallbackResponse: Message = {
        id: messages.length + 2,
        text: "Luca Corrao ti aspetta per trasformare le tue idee in realtà! Contattalo direttamente su WhatsApp per opportunità esclusive. 🚀",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackResponse])

      if (autoPlayEnabled) {
        setTimeout(() => speakText(fallbackResponse.text), 500)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage()
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    setTimeout(() => handleSendMessage(), 100)
  }

  const toggleAutoPlay = () => {
    setAutoPlayEnabled(!autoPlayEnabled)
    if (!autoPlayEnabled) {
      stopSpeaking()
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">AI Assistant di Luca</h2>
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xl text-gray-600">
            La mia intelligenza artificiale può guidarti, prenotare per te e rispondere alle tue domande
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!isOpen ? (
            <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-8 text-center" onClick={() => setIsOpen(true)}>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Inizia la Conversazione</h3>
                <p className="text-gray-600 mb-6">
                  Clicca per accedere all'AI che può prenotare, informare e trasformare le tue idee in opportunità
                  concrete
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 flex items-center gap-3 text-left hover:border-blue-400 transition-colors">
                  <Bot className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700 flex-1 font-medium">Scopri il mondo di Luca Corrao...</span>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-blue-300 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-b">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold">AI Assistant di Luca</div>
                    <div className="text-sm text-blue-100">
                      Controllo completo • Prenotazioni vocali • Informazioni • Audio attivo
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAutoPlay}
                      className="text-white hover:bg-white/20 p-2"
                      title={autoPlayEnabled ? "Disattiva audio automatico" : "Attiva audio automatico"}
                    >
                      {autoPlayEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                    {isSpeaking && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopSpeaking}
                        className="text-white hover:bg-white/20 p-2"
                        title="Ferma audio"
                      >
                        <VolumeX className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20"
                    >
                      Chiudi
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${message.isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isUser
                            ? "bg-gradient-to-r from-blue-600 to-purple-600"
                            : "bg-gradient-to-r from-gray-600 to-gray-700"
                        }`}
                      >
                        {message.isUser ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                          message.isUser
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
                            : "bg-white text-gray-900 border-2 border-gray-200 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        {!message.isUser && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(message.text)}
                            className="mt-2 p-1 h-6 text-gray-500 hover:text-gray-700"
                            title="Riproduci messaggio"
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-700">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white text-gray-900 border-2 border-gray-200 px-4 py-3 rounded-lg rounded-bl-sm shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">Elaborando la risposta perfetta...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white border-t-2 border-gray-200">
                  <div className="flex gap-3 items-end mb-3">
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Scrivi la tua domanda o richiesta..."
                        className="pr-12 py-3 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("Voglio prenotare una struttura")}
                      disabled={isLoading}
                      className="text-xs bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      Prenota con Voce
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("Dimmi degli AI Agent")}
                      disabled={isLoading}
                      className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 flex items-center gap-1"
                    >
                      <Bot className="w-3 h-3" />
                      AI Agent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("Chi è Luca Corrao?")}
                      disabled={isLoading}
                      className="text-xs bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                    >
                      Chi è Luca
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction("Voglio collaborare")}
                      disabled={isLoading}
                      className="text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                    >
                      Collabora
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800 mb-3 text-center font-medium">
                      🚀 Pronto per il prossimo livello? Connettiti direttamente!
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("https://wa.me/+393514206353", "_blank")}
                      className="w-full text-blue-700 border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp con Luca
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Voice Booking Assistant Modal */}
      {showVoiceBooking && <VoiceBookingAssistant onClose={() => setShowVoiceBooking(false)} />}
    </section>
  )
}
