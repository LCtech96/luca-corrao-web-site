"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Send } from "lucide-react"

interface ConsultationFormProps {
  onClose: () => void
}

export function ConsultationForm({ onClose }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    businessDescription: "",
    currentProblem: "",
    potentialSolution: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create WhatsApp message
    const message = `Ciao Luca! Ho compilato il form di consulenza:

👤 Nome: ${formData.name}
🏢 Business: ${formData.business}
📝 Descrizione Business: ${formData.businessDescription}
⚠️ Problema Attuale: ${formData.currentProblem}
💡 Possibile Soluzione: ${formData.potentialSolution}

Sono interessato/a a una consulenza strategica per trasformare digitalmente la mia azienda.`

    const whatsappUrl = `https://wa.me/+393514206353?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900">Richiesta Consulenza Strategica</CardTitle>
              <p className="text-gray-600 mt-2">Raccontaci del tuo business e come possiamo aiutarti</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Il tuo nome e cognome"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="business" className="text-sm font-medium text-gray-700">
                  Nome del Business *
                </Label>
                <Input
                  id="business"
                  required
                  value={formData.business}
                  onChange={(e) => handleInputChange("business", e.target.value)}
                  placeholder="Nome della tua azienda"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessDescription" className="text-sm font-medium text-gray-700">
                Descrizione del Business *
              </Label>
              <Textarea
                id="businessDescription"
                required
                rows={3}
                value={formData.businessDescription}
                onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                placeholder="Descrivi brevemente la tua attività, settore di riferimento, servizi/prodotti offerti..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="currentProblem" className="text-sm font-medium text-gray-700">
                Problema Attuale *
              </Label>
              <Textarea
                id="currentProblem"
                required
                rows={3}
                value={formData.currentProblem}
                onChange={(e) => handleInputChange("currentProblem", e.target.value)}
                placeholder="Qual è la sfida principale che stai affrontando? (es. gestione clienti, automazione processi, presenza digitale, efficienza operativa...)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="potentialSolution" className="text-sm font-medium text-gray-700">
                Possibile Soluzione
              </Label>
              <Textarea
                id="potentialSolution"
                rows={3}
                value={formData.potentialSolution}
                onChange={(e) => handleInputChange("potentialSolution", e.target.value)}
                placeholder="Hai già un'idea di come potremmo aiutarti? (es. AI per customer service, automazione marketing, sistema CRM personalizzato...)"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Opzionale - se non hai idee specifiche, ci pensiamo noi!</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🚀 Cosa Otterrai:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Analisi gratuita del tuo business</li>
                <li>• Strategia personalizzata di trasformazione digitale</li>
                <li>• Consulenza su soluzioni AI specifiche per il tuo settore</li>
                <li>• Roadmap dettagliata per l'implementazione</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Invia Richiesta via WhatsApp
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Annulla
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
