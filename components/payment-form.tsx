"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, CreditCard, Building, User, Mail, MessageCircle, Copy, CheckCircle, Euro } from "lucide-react"

interface PaymentFormProps {
  plan: {
    id: string
    name: string
    price: string
    period: string
    features: string[]
  }
  onClose: () => void
}

export function PaymentForm({ plan, onClose }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    vatNumber: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Italia",
    notes: "",
  })

  const [step, setStep] = useState<"form" | "payment">("form")
  const [copied, setCopied] = useState(false)

  const IBAN = "IT91Y0200843300000107305969"
  const BENEFICIARY = "Luca Corrao"

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("payment")
  }

  const copyIBAN = () => {
    navigator.clipboard.writeText(IBAN)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendWhatsAppConfirmation = () => {
    const message = `🎤 SOTTOSCRIZIONE AI AGENT VOCALE - ${plan.name}

👤 DATI CLIENTE:
Nome: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Telefono: ${formData.phone}
${formData.company ? `Azienda: ${formData.company}` : ""}
${formData.vatNumber ? `P.IVA: ${formData.vatNumber}` : ""}

📍 INDIRIZZO:
${formData.address}
${formData.city}, ${formData.zipCode}
${formData.country}

💰 PIANO SELEZIONATO:
${plan.name} - ${plan.price}${plan.period}

📋 CARATTERISTICHE INCLUSE:
${plan.features.map((feature) => `• ${feature}`).join("\n")}

💳 PAGAMENTO:
Ho effettuato il bonifico bancario a:
IBAN: ${IBAN}
Beneficiario: ${BENEFICIARY}
Causale: AI Agent Vocale - ${plan.name} - ${formData.firstName} ${formData.lastName}

${formData.notes ? `📝 Note aggiuntive: ${formData.notes}` : ""}

✅ Attendo conferma per l'attivazione del servizio!`

    const whatsappUrl = `https://wa.me/+393514206353?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    onClose()
  }

  if (step === "form") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  Sottoscrizione {plan.name}
                </CardTitle>
                <p className="text-gray-600 mt-2">Completa i tuoi dati per procedere con il pagamento</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Piano Selezionato */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-900">Piano Selezionato</h3>
                <Badge className="bg-purple-600 text-white">{plan.name}</Badge>
              </div>
              <div className="text-2xl font-bold text-purple-800 mb-2">
                {plan.price}
                <span className="text-sm font-normal">{plan.period}</span>
              </div>
              <div className="text-sm text-purple-700">
                {plan.features.slice(0, 3).map((feature, idx) => (
                  <div key={idx}>• {feature}</div>
                ))}
                {plan.features.length > 3 && <div>• +{plan.features.length - 3} altre caratteristiche</div>}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dati Personali */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Dati Personali
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Il tuo nome"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Cognome *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Il tuo cognome"
                    />
                  </div>
                </div>
              </div>

              {/* Contatti */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-600" />
                  Contatti
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="tua@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                </div>
              </div>

              {/* Dati Aziendali (Opzionali) */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Dati Aziendali (Opzionale)
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Nome Azienda</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="La tua azienda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vatNumber">Partita IVA</Label>
                    <Input
                      id="vatNumber"
                      value={formData.vatNumber}
                      onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                      placeholder="IT12345678901"
                    />
                  </div>
                </div>
              </div>

              {/* Indirizzo */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Indirizzo di Fatturazione</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Indirizzo *</Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Via, Numero civico"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Città *</Label>
                      <Input
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Roma"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">CAP *</Label>
                      <Input
                        id="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="00100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Paese *</Label>
                      <Input
                        id="country"
                        required
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="Italia"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div>
                <Label htmlFor="notes">Note Aggiuntive</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Eventuali richieste speciali o informazioni aggiuntive..."
                />
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3">
                Procedi al Pagamento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                <Euro className="w-6 h-6 text-green-600" />
                Istruzioni di Pagamento
              </CardTitle>
              <p className="text-gray-600 mt-2">Effettua il bonifico bancario per attivare il tuo piano</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Riepilogo Ordine */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2">Riepilogo Ordine</h3>
            <div className="flex justify-between items-center">
              <span className="text-purple-800">Piano {plan.name}</span>
              <span className="text-xl font-bold text-purple-800">
                {plan.price}
                {plan.period}
              </span>
            </div>
            <div className="text-sm text-purple-700 mt-2">
              Cliente: {formData.firstName} {formData.lastName}
            </div>
          </div>

          {/* Dati Bonifico */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Dati per il Bonifico Bancario
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-green-800 font-medium">Beneficiario</Label>
                <div className="bg-white p-3 rounded border flex items-center justify-between">
                  <span className="font-mono text-lg">{BENEFICIARY}</span>
                </div>
              </div>

              <div>
                <Label className="text-green-800 font-medium">IBAN</Label>
                <div className="bg-white p-3 rounded border flex items-center justify-between">
                  <span className="font-mono text-lg">{IBAN}</span>
                  <Button onClick={copyIBAN} size="sm" variant="outline" className="ml-2 bg-transparent">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {copied && <p className="text-sm text-green-600 mt-1">✅ IBAN copiato!</p>}
              </div>

              <div>
                <Label className="text-green-800 font-medium">Causale</Label>
                <div className="bg-white p-3 rounded border">
                  <span className="font-mono">
                    AI Agent Vocale - {plan.name} - {formData.firstName} {formData.lastName}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-green-800 font-medium">Importo</Label>
                <div className="bg-white p-3 rounded border">
                  <span className="font-mono text-xl font-bold">{plan.price.replace("€", "")} EUR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Istruzioni */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Istruzioni</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Effettua il bonifico bancario con i dati sopra indicati</li>
              <li>2. Clicca "Conferma Pagamento" qui sotto per inviarci i dettagli</li>
              <li>3. Ti contatteremo su WhatsApp per confermare l'attivazione</li>
              <li>4. Il servizio sarà attivo entro 24 ore dalla conferma del pagamento</li>
            </ol>
          </div>

          <Button onClick={sendWhatsAppConfirmation} className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
            <MessageCircle className="w-5 h-5 mr-2" />
            Conferma Pagamento Effettuato
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
