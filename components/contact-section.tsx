"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Code,
  Building2,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react"
import Image from "next/image"
import { GuidedBookingWorkflow } from "./guided-booking-workflow"

export function ContactSection() {
  const [showBookingWorkflow, setShowBookingWorkflow] = useState(false)

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siamo qui per trasformare le tue idee in realtà</h2>
          <p className="text-xl text-gray-300 mb-12">
            e le tue vacanze in ricordi indimenticabili. Non aspettare, il tuo prossimo passo è qui.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors relative overflow-hidden">
              <CardContent className="p-8 text-center relative z-10">
                <Code className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Soluzioni Tech & AI</h3>
                <p className="text-gray-300 mb-6">
                  Trasforma il tuo business con l'Intelligenza Artificiale e soluzioni software innovative
                </p>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  onClick={() =>
                    window.open(
                      "https://wa.me/+393514206353?text=Ciao Luca, sono interessato alle tue soluzioni AI e software",
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contattaci per la tua Soluzione Software
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-colors">
              <CardContent className="p-8 text-center">
                <Building2 className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Ospitalità Siciliana</h3>
                <p className="text-gray-300 mb-6">
                  Vivi un'esperienza unica nelle nostre strutture ricettive di eccellenza in Sicilia
                </p>
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white w-full"
                  onClick={() => setShowBookingWorkflow(true)}
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Prenota il Tuo Soggiorno dei Sogni
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">WhatsApp</h4>
              <Button
                variant="link"
                className="text-green-400 hover:text-green-300 p-0"
                onClick={() => window.open("https://wa.me/+393514206353", "_blank")}
              >
                +39 351 420 6353
              </Button>
            </div>

            <div className="text-center">
              <Phone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Telefono</h4>
              <Button
                variant="link"
                className="text-blue-400 hover:text-blue-300 p-0"
                onClick={() => window.open("tel:+393513671340", "_blank")}
              >
                +39 351 367 1340
              </Button>
            </div>

            <div className="text-center">
              <Mail className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Email</h4>
              <Button
                variant="link"
                className="text-purple-400 hover:text-purple-300 p-0"
                onClick={() => window.open("mailto:lucacorrao1996@gmail.com", "_blank")}
              >
                lucacorrao1996@gmail.com
              </Button>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-300">Seguici sui Social</h3>
            <div className="flex justify-center gap-6">
              <Button
                variant="ghost"
                size="lg"
                className="text-pink-400 hover:text-pink-300 hover:bg-pink-400/10 flex items-center gap-2"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/luca.corrao.s?igsh=MXhuN3hiamh4bTNpaQ%3D%3D&utm_source=qr",
                    "_blank",
                  )
                }
              >
                <Instagram className="w-6 h-6" />
                <span className="hidden sm:inline">Instagram</span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 flex items-center gap-2"
                onClick={() => window.open("https://www.facebook.com/people/Luca-Corrao/pfbid021tDysnufGorRVgbBAkKyZkr94y3pRt2km9GuYixDE4b3SWS5P4faqUbbf5LQptsQl/", "_blank")}
              >
                <Facebook className="w-6 h-6" />
                <span className="hidden sm:inline">Facebook</span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-blue-300 hover:text-blue-200 hover:bg-blue-300/10 flex items-center gap-2"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/luca-corrao-b8194b35b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
                    "_blank",
                  )
                }
              >
                <Linkedin className="w-6 h-6" />
                <span className="hidden sm:inline">LinkedIn</span>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-gray-300 hover:text-white hover:bg-gray-300/10 flex items-center gap-2"
                onClick={() => window.open("https://x.com/luca_corrao?s=21", "_blank")}
              >
                <Twitter className="w-6 h-6" />
                <span className="hidden sm:inline">X Twitter</span>
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
              <MapPin className="w-5 h-5" />
              <span>Terrasini, Palermo - Sicilia, Italia</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              © 2024 Luca Corrao. Tutti i diritti riservati. | Intelligenza Artificiale & Ospitalità Siciliana
            </p>
            <p className="text-xs text-gray-500">
              🚀 Visionario in stealth mode - Il futuro dell'AI e dell'ospitalità mediterranea
            </p>
          </div>
        </div>
      </div>

      {/* Guided Booking Workflow Modal */}
      {showBookingWorkflow && <GuidedBookingWorkflow onClose={() => setShowBookingWorkflow(false)} />}
    </section>
  )
}
