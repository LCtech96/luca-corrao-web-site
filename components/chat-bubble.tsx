"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import Image from "next/image"
import { AIPersistentChat } from "./ai-persistent-chat"

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    setHasUnread(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleNewMessage = () => {
    if (!isOpen) {
      setHasUnread(true)
    }
  }

  return (
    <>
      {/* Chat Modal */}
      {isOpen && (
        <AIPersistentChat 
          onClose={handleClose} 
          onNewMessage={handleNewMessage}
        />
      )}

      {/* Floating Chat Bubble - Responsive */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
          aria-label="Apri chat con NOM.AI"
        >
          {/* Bubble con immagine profilo */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
            
            {/* Profile Image - Responsive size */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 border-cyan-400 shadow-2xl shadow-cyan-500/50 active:scale-95 sm:group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/luca-corrao-profile.jpg"
                alt="NOM.AI Assistant"
                fill
                className="object-cover"
              />
            </div>

            {/* Badge notifica se ci sono messaggi non letti */}
            {hasUnread && (
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                <span className="text-[10px] sm:text-xs text-white font-bold">!</span>
              </div>
            )}

            {/* Icona chat sovrapposta */}
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>

          {/* Tooltip - Solo desktop */}
          <div className="hidden sm:block absolute bottom-20 right-0 bg-black/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chatta con NOM.AI 💬
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-black/90 rotate-45" />
          </div>
        </button>
      )}
    </>
  )
}

