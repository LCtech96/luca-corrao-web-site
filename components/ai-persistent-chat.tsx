"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Loader2, Sparkles, ExternalLink, Trash2, Mic, MicOff, Image as ImageIcon, Plus, MessageSquare, Menu, ChevronLeft } from "lucide-react"
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
  images?: string[] // URLs delle immagini allegate
}

interface Project {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface AIPersistentChatProps {
  onClose: () => void
  onNewMessage?: () => void
}

const STORAGE_KEY = 'nomAI_chat_history'
const PROJECTS_STORAGE_KEY = 'nomAI_projects'
const WELCOME_MESSAGE = "Come posso aiutarti?"

export function AIPersistentChat({ onClose, onNewMessage }: AIPersistentChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom quando arrivano nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Carica progetti da localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects)
        const projectsWithDates = parsed.map((proj: any) => ({
          ...proj,
          createdAt: new Date(proj.createdAt),
          updatedAt: new Date(proj.updatedAt),
          messages: proj.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))
        setProjects(projectsWithDates)
        
        // Carica l'ultimo progetto aperto
        if (projectsWithDates.length > 0) {
          const lastProject = projectsWithDates[0]
          setCurrentProjectId(lastProject.id)
          setMessages(lastProject.messages)
        } else {
          createNewProject()
        }
      } catch (error) {
        console.error('Error loading projects:', error)
        createNewProject()
      }
    } else {
      // Prima visita - crea primo progetto
      createNewProject()
    }
  }, [])

  // Salva progetto corrente in localStorage quando cambiano i messaggi
  useEffect(() => {
    if (currentProjectId && messages.length > 0) {
      saveCurrentProject()
    }
  }, [messages, currentProjectId])

  // Inizializza Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = 'it-IT'
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          
          if (event.error === 'no-speech') {
            toast({
              title: "Nessun audio rilevato",
              description: "Parla più forte o avvicina il microfono",
              variant: "destructive",
            })
          } else if (event.error === 'not-allowed') {
            toast({
              title: "Microfono bloccato",
              description: "Abilita il microfono nelle impostazioni del browser",
              variant: "destructive",
            })
          }
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const initializeWelcome = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date()
    }])
  }

  const createNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "Nuova conversazione",
      messages: [{
        id: '0',
        role: 'assistant',
        content: WELCOME_MESSAGE,
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setProjects(prev => [newProject, ...prev])
    setCurrentProjectId(newProject.id)
    setMessages(newProject.messages)
    setUploadedImages([])
    
    // Salva subito
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([newProject, ...projects]))
    
    toast({
      title: "Nuovo progetto creato",
      description: "Inizia una nuova conversazione",
    })
  }

  const saveCurrentProject = () => {
    if (!currentProjectId) return
    
    setProjects(prev => {
      const updatedProjects = prev.map(proj => {
        if (proj.id === currentProjectId) {
          // Genera titolo automatico dal primo messaggio utente
          const firstUserMsg = messages.find(m => m.role === 'user')
          const autoTitle = firstUserMsg 
            ? firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
            : 'Nuova conversazione'
          
          return {
            ...proj,
            title: proj.title === 'Nuova conversazione' ? autoTitle : proj.title,
            messages,
            updatedAt: new Date()
          }
        }
        return proj
      })
      
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects))
      return updatedProjects
    })
  }

  const switchProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setCurrentProjectId(project.id)
      setMessages(project.messages)
      setUploadedImages([])
    }
  }

  const deleteProject = (projectId: string) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== projectId)
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered))
      
      // Se era il progetto corrente, crea un nuovo progetto
      if (projectId === currentProjectId) {
        if (filtered.length > 0) {
          setCurrentProjectId(filtered[0].id)
          setMessages(filtered[0].messages)
        } else {
          createNewProject()
        }
      }
      
      return filtered
    })
    
    toast({
      title: "Progetto eliminato",
      description: "Il progetto è stato rimosso",
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // Converti files in blob URLs per preview
    const newImageUrls: string[] = []
    for (let i = 0; i < Math.min(files.length, 5); i++) { // Max 5 immagini
      const url = URL.createObjectURL(files[i])
      newImageUrls.push(url)
    }
    
    setUploadedImages(prev => [...prev, ...newImageUrls])
    
    toast({
      title: "Immagini caricate",
      description: `${newImageUrls.length} immagine/i pronta/e per l'invio`,
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const clearHistory = () => {
    if (currentProjectId) {
      deleteProject(currentProjectId)
    }
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
    if ((!input.trim() && uploadedImages.length === 0) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim() || "📷 [Immagini allegate]",
      timestamp: new Date(),
      images: uploadedImages.length > 0 ? [...uploadedImages] : undefined
    }

    // Aggiungi messaggio utente
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setUploadedImages([]) // Pulisci le immagini dopo l'invio
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

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Input vocale non supportato",
        description: "Il tuo browser non supporta il riconoscimento vocale",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      // Start listening
      try {
        recognitionRef.current.start()
        setIsListening(true)
        toast({
          title: "Microfono attivo",
          description: "Parla ora... 🎤",
        })
      } catch (error) {
        console.error('Error starting recognition:', error)
        toast({
          title: "Errore microfono",
          description: "Impossibile avviare il riconoscimento vocale",
          variant: "destructive",
        })
      }
    }
  }

  const currentProject = projects.find(p => p.id === currentProjectId)

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Chat Window - Redesigned with Sidebar */}
      <div className="fixed inset-0 sm:inset-4 sm:left-auto sm:right-4 z-50 w-full sm:w-[900px] sm:max-w-[95vw] h-full sm:h-[85vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 border-0 sm:border border-cyan-500/30 rounded-none sm:rounded-3xl shadow-2xl shadow-cyan-500/20 flex overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Sidebar - Projects */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} sm:w-64 bg-gray-900/50 border-r border-cyan-500/20 flex flex-col transition-all duration-300 overflow-hidden`}>
          <div className="p-4 border-b border-cyan-500/20">
            <Button 
              onClick={createNewProject}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl flex items-center justify-center gap-2 py-2.5"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold">Nuovo Progetto</span>
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => switchProject(project.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                  project.id === currentProjectId 
                    ? 'bg-cyan-500/20 border border-cyan-500/50' 
                    : 'bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50 hover:border-gray-600/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-white truncate">{project.title}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {project.messages.length} messaggi · {new Date(project.updatedAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProject(project.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-cyan-500/20 bg-black/40">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Toggle Sidebar Button (Mobile) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              
              {/* Profile Image */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/50 flex-shrink-0">
                <Image
                  src="/images/luca-corrao-profile.jpg"
                  alt="NOM.AI"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2">
                  {currentProject?.title || 'NOM.AI'}
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                </h2>
                <a 
                  href="https://app.nomadiqe.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] sm:text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-0.5 sm:gap-1 truncate"
                >
                  <span className="truncate">Powered by app.nomadiqe.com</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearHistory}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full w-8 h-8 sm:w-9 sm:h-9"
                title="Elimina progetto"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 sm:w-9 sm:h-9"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Messages - Responsive padding */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            {messages.map((message) => {
              // Rileva se il messaggio contiene immagini (formato: [IMAGES:url1:slug1|url2:slug2])
              const isAIImageMessage = message.content.startsWith('[IMAGES:')
              const hasUserImages = message.images && message.images.length > 0
              
              const imagesData = isAIImageMessage 
                ? message.content.replace('[IMAGES:', '').replace(']', '').split('|').map(item => {
                    const parts = item.split(':')
                    if (parts.length < 3) return { url: '', slug: '', isExternal: false, externalUrl: '' }
                    
                    const urlParts: string[] = []
                    let foundExternal = false
                    let externalUrlParts: string[] = []
                    
                    for (let i = 0; i < parts.length; i++) {
                      if (parts[i] === 'EXTERNAL') {
                        foundExternal = true
                        continue
                      }
                      if (foundExternal) {
                        externalUrlParts.push(parts[i])
                      } else if (i < parts.length - 1 || !foundExternal) {
                        urlParts.push(parts[i])
                      }
                    }
                    
                    const url = foundExternal ? urlParts.join(':').trim() : urlParts.slice(0, -1).join(':').trim()
                    const slug = foundExternal ? '' : urlParts[urlParts.length - 1]?.trim()
                    const externalUrl = foundExternal ? externalUrlParts.join(':').trim() : ''
                    
                    return { url, slug, isExternal: foundExternal, externalUrl }
                  }).filter(img => img.url && (img.slug || img.externalUrl))
                : []

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {isAIImageMessage ? (
                    // Rendering immagini AI (property suggestions)
                    <div className="max-w-[95%] sm:max-w-[80%] space-y-1.5 sm:space-y-2">
                      {imagesData.map((img, index) => (
                        <div 
                          key={index} 
                          className="rounded-xl sm:rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg active:scale-95 sm:hover:border-cyan-400 sm:hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer group relative"
                          onClick={() => {
                            if (img.isExternal && img.externalUrl) {
                              window.open(img.externalUrl, '_blank', 'noopener,noreferrer')
                            } else {
                              router.push(`/property/${img.slug}`)
                              onClose()
                            }
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt="Anteprima struttura"
                            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.svg'}
                          />
                          <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 bg-cyan-500 rounded-full p-2 sm:p-3">
                              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <p className="text-[10px] sm:text-xs text-gray-400 text-center px-2">
                        👆 Clicca per aprire · {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ) : (
                    // Rendering messaggio testuale (con eventuali immagini utente)
                    <div className={`max-w-[90%] sm:max-w-[80%] space-y-2`}>
                      {/* Immagini utente (se presenti) */}
                      {hasUserImages && (
                        <div className="grid grid-cols-2 gap-2">
                          {message.images!.map((imgUrl, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border-2 border-cyan-400/50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgUrl} alt={`Immagine ${idx + 1}`} className="w-full h-32 object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Testo messaggio */}
                      <div
                        className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            : 'bg-gray-800/50 text-white border border-gray-700/50'
                        }`}
                      >
                        <p className="text-[13px] sm:text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                        <p className="text-[10px] sm:text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
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

          {/* Input Area - Responsive */}
          <div className="p-3 sm:p-4 border-t border-cyan-500/20 bg-black/40 safe-area-bottom">
            {/* Preview immagini caricate */}
            {uploadedImages.length > 0 && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500/20">
                {uploadedImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border-2 border-cyan-400/50 flex-shrink-0 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              {/* File input nascosto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Bottone Upload Immagini */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || uploadedImages.length >= 5}
                className="rounded-full w-10 h-10 sm:w-11 sm:h-11 p-0 bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-500/30 flex-shrink-0"
                title="Carica immagini (max 5)"
              >
                <ImageIcon className="w-4 h-4 text-white" />
              </Button>
              
              {/* Bottone Microfono */}
              <Button
                onClick={toggleVoiceInput}
                disabled={isLoading}
                className={`rounded-full w-10 h-10 sm:w-11 sm:h-11 p-0 shadow-lg flex-shrink-0 transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50' 
                    : 'bg-gray-700 hover:bg-gray-600 shadow-gray-500/30'
                }`}
                title={isListening ? "Stop microfono" : "Parla con NOM.AI"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-white" />
                )}
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "🎤 Sto ascoltando..." : "Scrivi un messaggio..."}
                disabled={isLoading || isListening}
                className="flex-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/50 rounded-full h-10 sm:h-11 text-base sm:text-sm"
                style={{ fontSize: '16px' }}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && uploadedImages.length === 0)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full w-10 h-10 sm:w-11 sm:h-11 p-0 shadow-lg shadow-cyan-500/50 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 text-center px-2">
              {isListening ? "🎤 Parla ora... (tocca microfono per fermare)" : uploadedImages.length > 0 ? `📷 ${uploadedImages.length} immagine/i pronta/e per l'invio` : "Le risposte sono generate da AI e potrebbero non essere sempre accurate"}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

