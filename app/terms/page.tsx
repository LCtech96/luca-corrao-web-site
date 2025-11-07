import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Torna alla Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-gray-900">Termini e Condizioni d'Uso</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Accettazione dei Termini</h2>
            <p>
              Utilizzando lucacorrao.com, accetti questi Termini e Condizioni. Se non accetti questi termini, 
              ti preghiamo di non utilizzare il sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Servizi Offerti</h2>
            <p>
              Luca Corrao Website offre:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Piattaforma per prenotazione di strutture ricettive</li>
              <li>Soluzioni AI per l'ospitalità</li>
              <li>Servizi di consulenza tecnologica</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Account Utente</h2>
            <p>
              Per utilizzare alcune funzionalità, potresti dover creare un account. Ti impegni a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornire informazioni accurate e aggiornate</li>
              <li>Mantenere la sicurezza del tuo account</li>
              <li>Notificarci immediatamente in caso di accesso non autorizzato</li>
              <li>Essere responsabile di tutte le attività del tuo account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Prenotazioni</h2>
            <p>
              Quando effettui una prenotazione:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le informazioni fornite devono essere accurate</li>
              <li>La conferma è soggetta alla disponibilità</li>
              <li>Le politiche di cancellazione variano per proprietà</li>
              <li>I pagamenti devono essere effettuati secondo le istruzioni fornite</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Pagamenti</h2>
            <p>
              Accettiamo pagamenti tramite:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Revolut</li>
              <li>Bonifico bancario (IBAN)</li>
              <li>Criptovalute (in fase di implementazione)</li>
            </ul>
            <p className="mt-4">
              Tutti i pagamenti sono processati in modo sicuro. Non memorizziamo informazioni di carte di credito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Proprietà Intellettuale</h2>
            <p>
              Tutti i contenuti del sito (testi, immagini, loghi, design) sono di proprietà di Luca Corrao 
              o dei rispettivi proprietari e sono protetti da copyright.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Limitazione di Responsabilità</h2>
            <p>
              Il sito è fornito "così com'è". Non garantiamo che il servizio sarà ininterrotto o privo di errori. 
              Non siamo responsabili per eventuali danni derivanti dall'uso del sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Modifiche ai Termini</h2>
            <p>
              Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. 
              Le modifiche entrano in vigore immediatamente dopo la pubblicazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Legge Applicabile</h2>
            <p>
              Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia, 
              sarà competente il foro di Palermo, Italia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Contatti</h2>
            <p>Per domande sui Termini e Condizioni:</p>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> <a href="mailto:luca@bedda.tech" className="text-blue-600 hover:underline">luca@bedda.tech</a></li>
              <li><strong>Sito:</strong> <a href="https://lucacorrao.com" className="text-blue-600 hover:underline">lucacorrao.com</a></li>
            </ul>
          </section>

          <div className="bg-gray-100 p-6 rounded-lg mt-8">
            <p className="text-sm">
              Leggi anche la nostra{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline font-semibold">
                Privacy Policy
              </Link>
              {" "}e le istruzioni per la{" "}
              <Link href="/data-deletion" className="text-blue-600 hover:underline font-semibold">
                Cancellazione dei Dati
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

