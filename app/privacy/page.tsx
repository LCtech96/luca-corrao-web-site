import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Torna alla Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduzione</h2>
            <p>
              Benvenuto su Luca Corrao Website (lucacorrao.com). Questa Privacy Policy descrive come raccogliamo, 
              utilizziamo e proteggiamo le tue informazioni personali quando utilizzi il nostro sito web e i nostri servizi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Dati Raccolti</h2>
            <p>Raccogliamo le seguenti informazioni:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informazioni di account:</strong> Nome, email, numero di telefono quando ti registri</li>
              <li><strong>Informazioni di autenticazione:</strong> Dati forniti tramite Google, Facebook o altri provider OAuth</li>
              <li><strong>Informazioni di prenotazione:</strong> Date, numero ospiti, preferenze</li>
              <li><strong>Dati di pagamento:</strong> Informazioni necessarie per processare pagamenti (gestite da provider terzi come Revolut)</li>
              <li><strong>Cookie e dati tecnici:</strong> Indirizzo IP, browser, dispositivo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Utilizzo dei Dati</h2>
            <p>Utilizziamo i tuoi dati per:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornire e migliorare i nostri servizi di prenotazione</li>
              <li>Comunicare con te riguardo alle tue prenotazioni</li>
              <li>Processare pagamenti in modo sicuro</li>
              <li>Personalizzare la tua esperienza sul sito</li>
              <li>Rispettare obblighi legali</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Condivisione dei Dati</h2>
            <p>
              Non vendiamo i tuoi dati personali a terze parti. Condividiamo i tuoi dati solo con:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Provider di servizi:</strong> Supabase (database), Vercel (hosting)</li>
              <li><strong>Provider di pagamento:</strong> Revolut, processori di pagamento</li>
              <li><strong>Provider OAuth:</strong> Google, Facebook (solo per autenticazione)</li>
              <li><strong>Host delle proprietà:</strong> Per gestire le tue prenotazioni</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Sicurezza</h2>
            <p>
              Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati, inclusi:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Crittografia SSL/TLS per tutte le comunicazioni</li>
              <li>Row Level Security (RLS) sul database</li>
              <li>Autenticazione sicura tramite OAuth 2.0</li>
              <li>Accesso limitato ai dati personali</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">6. I Tuoi Diritti (GDPR)</h2>
            <p>Hai diritto a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Accesso:</strong> Richiedere una copia dei tuoi dati</li>
              <li><strong>Rettifica:</strong> Correggere dati inesatti</li>
              <li><strong>Cancellazione:</strong> Richiedere la cancellazione dei tuoi dati</li>
              <li><strong>Portabilità:</strong> Ricevere i tuoi dati in formato strutturato</li>
              <li><strong>Opposizione:</strong> Opporti al trattamento dei tuoi dati</li>
            </ul>
            <p className="mt-4">
              Per esercitare questi diritti, contattaci a: <a href="mailto:lucacorrao1996@gmail.com" className="text-blue-600 hover:underline">lucacorrao1996@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Cookie</h2>
            <p>
              Utilizziamo cookie essenziali per il funzionamento del sito (autenticazione, preferenze). 
              Puoi disabilitare i cookie nelle impostazioni del browser, ma alcune funzionalità potrebbero non funzionare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Modifiche alla Privacy Policy</h2>
            <p>
              Potremmo aggiornare questa Privacy Policy periodicamente. La data dell'ultimo aggiornamento è 
              indicata in cima alla pagina. Ti consigliamo di rivedere questa pagina regolarmente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Contatti</h2>
            <p>Per domande sulla privacy, contattaci:</p>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> <a href="mailto:lucacorrao1996@gmail.com" className="text-blue-600 hover:underline">lucacorrao1996@gmail.com</a></li>
              <li><strong>Sito:</strong> <a href="https://lucacorrao.com" className="text-blue-600 hover:underline">lucacorrao.com</a></li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Informazioni sulla Cancellazione dei Dati</h2>
            <p>
              Se desideri cancellare i tuoi dati, visita la nostra pagina dedicata:{" "}
              <Link href="/data-deletion" className="text-blue-600 hover:underline font-semibold">
                Cancellazione Dati
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

