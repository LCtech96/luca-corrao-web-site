"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Star, 
  Building2, 
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Camera
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { WorkWithUsModal } from "./work-with-us-modal"
import { ShowcaseModal } from "./showcase-modal"
import { ReviewForm } from "./review-form"

interface UserDashboardProps {
  onClose: () => void
}

export function UserDashboard({ onClose }: UserDashboardProps) {
  const { user, logout } = useAuth()
  const [activeModal, setActiveModal] = useState<"work" | "showcase" | "review" | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "structures" | "reviews" | "settings">("overview")

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const features = [
    {
      id: "upload-structures",
      title: "Carica le tue strutture",
      description: "Aggiungi le tue strutture ricettive con foto e descrizioni",
      icon: Building2,
      action: () => setActiveModal("work"),
      badge: "Disponibile"
    },
    {
      id: "upload-images",
      title: "Carica immagini strutture",
      description: "Aggiungi foto delle tue strutture per la vetrina",
      icon: Camera,
      action: () => setActiveModal("work"),
      badge: "Disponibile"
    },
    {
      id: "write-reviews",
      title: "Scrivi recensioni",
      description: "Lascia recensioni sulle strutture dove hai pernottato",
      icon: Star,
      action: () => setActiveModal("review"),
      badge: "Disponibile"
    },
    {
      id: "manage-structures",
      title: "Gestisci strutture",
      description: "Modifica o elimina le tue strutture pubblicate",
      icon: Settings,
      action: () => setActiveModal("showcase"),
      badge: "Disponibile"
    }
  ]

  const userStats = [
    { label: "Strutture caricate", value: "2", icon: Building2 },
    { label: "Recensioni scritte", value: "5", icon: Star },
    { label: "Immagini caricate", value: "12", icon: ImageIcon },
    { label: "Messaggi ricevuti", value: "3", icon: MessageSquare }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Area Utente</h2>
              <p className="text-gray-600">Benvenuto, {user?.name}!</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Panoramica" },
              { id: "structures", label: "Le mie strutture" },
              { id: "reviews", label: "Le mie recensioni" },
              { id: "settings", label: "Impostazioni" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userStats.map((stat) => (
                  <Card key={stat.label} className="text-center">
                    <CardContent className="p-4">
                      <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Funzionalità disponibili</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <Card key={feature.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={feature.action}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <feature.icon className="w-8 h-8 text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {feature.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Azioni rapide</h3>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => setActiveModal("work")} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Carica nuova struttura
                  </Button>
                  <Button variant="outline" onClick={() => setActiveModal("review")} className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Scrivi recensione
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Carica immagini
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "structures" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Le mie strutture</h3>
                <Button onClick={() => setActiveModal("work")} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Aggiungi struttura
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Strutture di esempio */}
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                    <h4 className="font-semibold">Lucas Rooftop</h4>
                    <p className="text-sm text-gray-600">Terrasini, PA</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                    <h4 className="font-semibold">Lucas Suite</h4>
                    <p className="text-sm text-gray-600">Terrasini, PA</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.9</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Le mie recensioni</h3>
                <Button variant="outline" onClick={() => setActiveModal("review")} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Scrivi recensione
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Recensioni di esempio */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Villa Panoramica</h4>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      "Struttura meravigliosa con vista panoramica. Personale gentilissimo e servizi impeccabili."
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Pubblicata il 15/03/2024</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Impostazioni account</h3>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome utente</label>
                      <input
                        type="text"
                        value={user?.name || ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data registrazione</label>
                      <input
                        type="text"
                        value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : ""}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <Button variant="outline" onClick={onClose} className="w-full">
            Chiudi
          </Button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "work" && (
        <WorkWithUsModal onClose={closeModal} />
      )}
      
      {activeModal === "showcase" && (
        <ShowcaseModal onClose={closeModal} />
      )}

      {activeModal === "review" && (
        <ReviewForm 
          isOpen={true} 
          onClose={closeModal}
        />
      )}
    </div>
  )
} 