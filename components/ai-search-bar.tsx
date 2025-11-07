"use client"

import { useState } from "react"
import { Search, Sparkles, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AISearchBar() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)

    // TODO: Integrare API LLM qui (OpenAI, Anthropic, Gemini, etc.)
    // Esempio:
    // const response = await fetch('/api/ai-search', {
    //   method: 'POST',
    //   body: JSON.stringify({ query })
    // })
    
    // Simulazione per ora
    setTimeout(() => {
      console.log('AI Query:', query)
      // TODO: Gestire la risposta e navigare/eseguire azione
      setIsLoading(false)
    }, 1000)
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
            className="w-full pl-12 pr-12 py-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-full text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
            disabled={isLoading}
          />

          {/* Bottone Search */}
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full w-10 h-10 shadow-lg shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Label sottotitolo */}
        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Assistente AI - Naviga il sito con linguaggio naturale</span>
        </div>
      </form>
    </div>
  )
}

