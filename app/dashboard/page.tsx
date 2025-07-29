import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserButton } from "@clerk/nextjs"

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Strutture Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Le Mie Strutture</CardTitle>
              <CardDescription>
                Gestisci le tue strutture ricettive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Visualizza e gestisci le prenotazioni, le recensioni e le informazioni delle tue strutture.
              </p>
              <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                Gestisci Strutture
              </Button>
            </CardContent>
          </Card>

          {/* AI Solutions Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Soluzioni AI</CardTitle>
              <CardDescription>
                Scopri le soluzioni di intelligenza artificiale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Esplora le nostre soluzioni AI per l'automazione e l'ottimizzazione dei processi.
              </p>
              <Button variant="outline" className="w-full">
                Scopri Soluzioni AI
              </Button>
            </CardContent>
          </Card>

          {/* Chat AI Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Chat AI</CardTitle>
              <CardDescription>
                Interagisci con l'assistente AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Chatta con il nostro assistente AI per ricevere supporto e informazioni.
              </p>
              <Button variant="outline" className="w-full">
                Inizia Chat
              </Button>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Impostazioni</CardTitle>
              <CardDescription>
                Gestisci le tue preferenze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Modifica le tue informazioni personali e le impostazioni dell'account.
              </p>
              <Button variant="outline" className="w-full">
                Modifica Impostazioni
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Benvenuto nel tuo Dashboard</CardTitle>
              <CardDescription>
                Gestisci le tue strutture ricettive e scopri le soluzioni AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Questo è il tuo spazio personale dove puoi gestire tutto ciò che riguarda le tue strutture ricettive 
                e accedere alle nostre soluzioni di intelligenza artificiale. Utilizza i menu sopra per navigare 
                tra le diverse sezioni.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 