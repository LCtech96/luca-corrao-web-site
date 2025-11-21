import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Mail, Trash2, Shield, AlertCircle } from "lucide-react"

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Torna alla Home
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Cancellazione Dati</h1>
              <p className="text-gray-600">Istruzioni per eliminare i tuoi dati personali</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Informazioni Importanti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Rispettiamo il tuo diritto alla privacy e alla cancellazione dei dati personali in conformità 
                  con il Regolamento Generale sulla Protezione dei Dati (GDPR) dell'Unione Europea.
                </p>
                <p className="text-gray-700">
                  Quando richiedi la cancellazione dei dati, elimineremo permanentemente tutte le informazioni 
                  personali associate al tuo account dal nostro database entro <strong>30 giorni</strong>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Cosa Verrà Eliminato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Nome completo</li>
                  <li>Indirizzo email</li>
                  <li>Numero di telefono</li>
                  <li>Informazioni di autenticazione (Google, Facebook, etc.)</li>
                  <li>Storico prenotazioni</li>
                  <li>Messaggi e comunicazioni</li>
                  <li>Preferenze e impostazioni</li>
                  <li>Qualsiasi altro dato personale associato al tuo account</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900">⚠️ Dati che Conserveremo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800">
                  Per obblighi legali e fiscali, potremmo dover conservare alcuni dati per un periodo di tempo, tra cui:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-amber-800 mt-4">
                  <li>Dati di fatturazione e transazioni (fino a 10 anni per legge italiana)</li>
                  <li>Log di sicurezza e anti-frode (anonimizzati)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Come Richiedere la Cancellazione
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 font-semibold">
                  Per richiedere la cancellazione dei tuoi dati, invia un'email a:
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900 mb-2">
                    <a href="mailto:lucacorrao1996@gmail.com" className="hover:underline">
                      lucacorrao1996@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700 text-sm">
                    Oggetto: Richiesta Cancellazione Dati - [La Tua Email]
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-gray-900">Includi nella tua richiesta:</p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Il tuo nome completo</li>
                    <li>L'indirizzo email associato al tuo account</li>
                    <li>Eventuali altri identificativi (numero telefono, username)</li>
                    <li>Conferma che desideri eliminare tutti i dati</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline di Cancellazione</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Invio Richiesta</p>
                      <p className="text-gray-600 text-sm">Invia email a lucacorrao1996@gmail.com</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Verifica Identità</p>
                      <p className="text-gray-600 text-sm">Entro 48 ore, verificheremo la tua identità</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Cancellazione</p>
                      <p className="text-gray-600 text-sm">Entro 30 giorni, elimineremo i tuoi dati</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Conferma</p>
                      <p className="text-gray-600 text-sm">Riceverai conferma via email</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Hai Domande?</h3>
              <p className="text-gray-700 mb-4">
                Per qualsiasi domanda sulla cancellazione dei dati o sulla privacy, contattaci:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:lucacorrao1996@gmail.com" className="text-blue-600 hover:underline">lucacorrao1996@gmail.com</a></p>
                <p><strong>Privacy Policy:</strong> <Link href="/privacy" className="text-blue-600 hover:underline">lucacorrao.com/privacy</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

