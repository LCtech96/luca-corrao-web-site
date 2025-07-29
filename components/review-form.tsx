"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
  structureId?: string
  structureName?: string
}

export function ReviewForm({ isOpen, onClose, structureId, structureName }: ReviewFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [structureNameInput, setStructureNameInput] = useState(structureName || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError("Devi essere registrato per scrivere una recensione")
      return
    }

    if (rating === 0) {
      setError("Seleziona un rating")
      return
    }

    if (comment.length < 10) {
      setError("Il commento deve essere di almeno 10 caratteri")
      return
    }

    if (!structureNameInput.trim()) {
      setError("Inserisci il nome della struttura")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structureId: structureId || `structure_${Date.now()}`,
          structureName: structureNameInput.trim(),
          rating,
          comment: comment.trim(),
          userEmail: user.email,
          userName: user.name
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setRating(0)
          setComment("")
          setStructureNameInput("")
        }, 2000)
      } else {
        setError(data.error || 'Errore nella pubblicazione della recensione')
      }
    } catch (error) {
      console.error('Errore recensione:', error)
      setError('Errore nella pubblicazione della recensione. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setRating(0)
      setComment("")
      setStructureNameInput("")
      setError("")
      setSuccess(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scrivi una recensione</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Recensione pubblicata con successo!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="structureName">Nome della struttura</Label>
              <Input
                id="structureName"
                type="text"
                value={structureNameInput}
                onChange={(e) => setStructureNameInput(e.target.value)}
                placeholder="Inserisci il nome della struttura"
                required
                disabled={!!structureName}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating === 1 && "Pessimo"}
                    {rating === 2 && "Scarso"}
                    {rating === 3 && "Discreto"}
                    {rating === 4 && "Buono"}
                    {rating === 5 && "Eccellente"}
                  </>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">La tua recensione</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Racconta la tua esperienza (almeno 10 caratteri)..."
                rows={4}
                required
              />
              <p className="text-sm text-gray-600">
                {comment.length}/500 caratteri
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Pubblicazione...' : 'Pubblica Recensione'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Annulla
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 