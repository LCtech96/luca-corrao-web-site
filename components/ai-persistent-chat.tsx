"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Loader2, Sparkles, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AIPersistentChatProps {
  onClose: () => void
  onNewMessage?: () => void
}

const STORAGE_KEY = 'nomAI_chat_history'
const WELCOME_MESSAGE = "👋 Ciao! Sono **NOM.AI**, il tuo assistente virtuale per lucacorrao.com.\n\nPosso aiutarti con:\n• 🏠 Informazioni sulle strutture (Lucas Suite, Trilu, Dani Holiday)\n• 📅 Processo di prenotazione e navigazione\n• 🏖️ Cosa vedere a Terrasini\n• 💬 Qualsiasi altra domanda!\n\nCome posso aiutarti oggi?"

export function AIPersistentChat({ onClose, onNewMessage }: AIPersistentChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-scroll to bottom quando arrivano nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Carica conversazione da localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        // Converti timestamp strings in Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(messagesWithDates)
      } catch (error) {
        console.error('Error loading chat history:', error)
        // Se errore, inizializza con messaggio di benvenuto
        initializeWelcome()
      }
    } else {
      // Prima visita - messaggio di benvenuto
      initializeWelcome()
    }
  }, [])

  // Salva conversazione in localStorage quando cambia
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const initializeWelcome = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date()
    }])
  }

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    initializeWelcome()
    toast({
      title: "Chat resettata",
      description: "La cronologia della conversazione è stata cancellata.",
    })
  }

  // Funzione per rilevare intent e eseguire azioni
  const executeAction = (response: string) => {
    // Rileva se l'AI ha suggerito di visitare una pagina
    const propertySlugMatch = response.match(/\[NAVIGATE:\/property\/([\w-]+)\]/i)
    
    if (propertySlugMatch) {
      const slug = propertySlugMatch[1]
      setTimeout(() => {
        toast({
          title: "Apertura pagina...",
          description: `Ti sto portando alla struttura`,
        })
        router.push(`/property/${slug}`)
        onClose() // Chiudi la chat
      }, 1500)
    }

    // Rileva richiesta di prenotazione
    if (response.match(/\[ACTION:BOOK\]/i)) {
      toast({
        title: "Prenotazione",
        description: "Clicca sul bottone 'Prenota' nella pagina della struttura",
      })
    }
  }

  // Funzione per estrarre immagini dal testo (nuovo formato: [IMAGE:URL:SLUG])
  const extractImages = (text: string): { cleanText: string; images: Array<{url: string; slug: string}> } => {
    const imageRegex = /\[IMAGE:([^:]+):([^\]]+)\]/gi
    const images: Array<{url: string; slug: string}> = []
    let match

    while ((match = imageRegex.exec(text)) !== null) {
      images.push({
        url: match[1],
        slug: match[2]
      })
    }

    const cleanText = text.replace(imageRegex, '').trim()
    return { cleanText, images }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    // Aggiungi messaggio utente
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      // Invia TUTTA la conversazione per mantenere il contesto
      const conversationHistory = updatedMessages
        .filter(msg => msg.role !== 'system') // Escludi messaggi di sistema se presenti
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: conversationHistory // Invia array di messaggi invece di singola query
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Errore nella richiesta')
      }

      // Rimuovi marker di azione dalla risposta mostrata all'utente
      let displayResponse = data.response
      const cleanResponse = displayResponse
        .replace(/\[NAVIGATE:[^\]]+\]/gi, '')
        .replace(/\[ACTION:[^\]]+\]/gi, '')
        .replace(/\[IMAGE:[^\]]+\]/gi, '') // Rimuovi anche [IMAGE:...]
        .trim()

      // Aggiungi risposta AI
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      onNewMessage?.()

      // Esegui azioni se presenti (navigate, etc.)
      executeAction(data.response)

      // Se ci sono immagini, aggiungi messaggio separato con immagini
      const { images } = extractImages(data.response)
      if (images.length > 0) {
        const imagesData = images.map(img => `${img.url}:${img.slug}`).join('|')
        const imageMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `[IMAGES:${imagesData}]`, // Formato: [IMAGES:url1:slug1|url2:slug2]
          timestamp: new Date()
        }
        setMessages(prev => [...prev, imageMessage])
      }

    } catch (error) {
      console.error('Chat error:', error)
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Impossibile ottenere una risposta. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/40">
          <div className="flex items-center gap-3">
            {/* Profile Image */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/50">
              <Image
                src="/images/luca-corrao-profile.jpg"
                alt="NOM.AI"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                NOM.AI
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h2>
              <a 
                href="https://app.nomadiqe.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                Powered by app.nomadiqe.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full"
              title="Reset chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
          {messages.map((message) => {
            // Rileva se il messaggio contiene immagini (formato: [IMAGES:url1:slug1|url2:slug2])
            const isImageMessage = message.content.startsWith('[IMAGES:')
            const imagesData = isImageMessage 
              ? message.content.replace('[IMAGES:', '').replace(']', '').split('|').map(item => {
                  // Split sull'ULTIMO ':' per non rompere https://
                  const lastColonIndex = item.lastIndexOf(':')
                  if (lastColonIndex === -1) return { url: '', slug: '' } // Safety check
                  const url = item.substring(0, lastColonIndex).trim()
                  const slug = item.substring(lastColonIndex + 1).trim()
                  return { url, slug }
                }).filter(img => img.url && img.slug) // Rimuovi entry invalide
              : []

            return (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {isImageMessage ? (
                  // Rendering immagini cliccabili
                  <div className="max-w-[80%] space-y-2">
                    {imagesData.map((img, index) => (
                      <div 
                        key={index} 
                        className="rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg hover:border-cyan-400 hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer group relative"
                        onClick={() => {
                          toast({
                            title: "Apertura pagina...",
                            description: "Ti sto portando alla struttura",
                          })
                          router.push(`/property/${img.slug}`)
                          onClose()
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt="Anteprima struttura - Clicca per aprire"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback se immagine non carica
                            (e.target as HTMLImageElement).src = '/placeholder.svg'
                          }}
                        />
                        {/* Overlay hover con icona */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyan-500 rounded-full p-3">
                            <ExternalLink className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 text-center">
                      👆 Clicca sull'immagine per vedere i dettagli · {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ) : (
                  // Rendering messaggio testuale normale
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-gray-800/50 text-white border border-gray-700/50'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
            )
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-3">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-cyan-500/20 bg-black/40">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi un messaggio..."
              disabled={isLoading}
              className="flex-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50 rounded-full"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full w-10 h-10 p-0 shadow-lg shadow-cyan-500/50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Le risposte sono generate da AI e potrebbero non essere sempre accurate
          </p>
        </div>
      </div>
    </>
  )
}

