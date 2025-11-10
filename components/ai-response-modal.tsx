"use client"

import { useEffect, useState } from "react"
import { X, Sparkles, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIResponseModalProps {
  isOpen: boolean
  onClose: () => void
  query: string
  response: string
}

export function AIResponseModal({ isOpen, onClose, query, response }: AIResponseModalProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [copied, setCopied] = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) {
      setDisplayedText("")
      setIsTyping(true)
      return
    }

    let index = 0
    setDisplayedText("")
    setIsTyping(true)

    const interval = setInterval(() => {
      if (index < response.length) {
        setDisplayedText(response.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 20) // Velocità typewriter

    return () => clearInterval(interval)
  }, [response, isOpen])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/20 w-full max-w-3xl max-h-[80vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Assistente AI</h2>
                <p className="text-sm text-gray-400">Powered by Groq ⚡</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)] space-y-4">
            {/* User Query */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-1 font-medium">La tua domanda:</p>
              <p className="text-white">{query}</p>
            </div>

            {/* AI Response */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-cyan-400 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Risposta AI
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiato!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copia
                    </>
                  )}
                </Button>
              </div>
              <div className="text-white leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse" />}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cyan-500/20 bg-black/40">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Le risposte sono generate da AI e potrebbero non essere sempre accurate
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-6"
              >
                Chiudi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

