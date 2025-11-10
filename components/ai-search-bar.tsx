"use client"

import { useState } from "react"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AIResponseModal } from "./ai-response-modal"
import { useToast } from "@/hooks/use-toast"

export function AISearchBar() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore nella ricerca AI')
      }

      setAiResponse(data.response)
      setIsModalOpen(true)
      
    } catch (error) {
      console.error('AI Search error:', error)
      toast({
        title: "Errore AI",
        description: error instanceof Error ? error.message : "Impossibile ottenere una risposta dall'AI. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setQuery("")
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          {/* Icona AI */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>

          {/* Input */}
          <Input
            type="text"
            placeholder="Chiedi all'AI: 'Mostrami le strutture disponibili' o 'Prenota Lucas Suite'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-32 py-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-full text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
            disabled={isLoading}
          />

          {/* Bottone Invia */}
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full px-6 py-3 shadow-lg shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 font-semibold text-white flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Pensando...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Invia</span>
              </>
            )}
          </Button>
        </div>

        {/* Label sottotitolo */}
        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Assistente AI - Naviga il sito con linguaggio naturale</span>
        </div>
      </form>

      {/* Modal Risposta AI */}
      <AIResponseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        query={query}
        response={aiResponse}
      />
    </div>
  )
}

