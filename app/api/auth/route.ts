import { NextRequest, NextResponse } from 'next/server'

// Simula un database in memoria per i codici di verifica
const verificationCodes = new Map<string, { code: string, timestamp: number }>()
const resetCodes = new Map<string, { code: string, timestamp: number }>()

// Genera codice di verifica di 5 cifre
function generateVerificationCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

// Simula invio email (per ora)
async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  // In produzione, qui andrebbe il vero invio email
  console.log(`📧 Email di verifica inviata a ${email} con codice: ${code}`)
  return true
}

// Simula invio email di recupero
async function sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
  // In produzione, qui andrebbe il vero invio email
  console.log(`📧 Email di recupero inviata a ${email} con codice: ${code}`)
  return true
}

// POST - Registrazione utente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, motherMaidenName } = body

    console.log('API Auth chiamata con:', { action, email })

    if (action === 'register') {
      // Validazione campi
      if (!email || !password || !motherMaidenName) {
        return NextResponse.json(
          { error: 'Tutti i campi sono obbligatori' },
          { status: 400 }
        )
      }

      // Validazione email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Email non valida' },
          { status: 400 }
        )
      }

      // Validazione password
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password deve essere di almeno 8 caratteri' },
          { status: 400 }
        )
      }

      // Genera codice di verifica
      const verificationCode = generateVerificationCode()
      const timestamp = Date.now()
      
      // Salva il codice temporaneamente
      verificationCodes.set(email, { code: verificationCode, timestamp })
      
      console.log(`Codice generato per ${email}: ${verificationCode}`)
      
      // Simula invio email di verifica
      const emailSent = await sendVerificationEmail(email, verificationCode)
      
      if (emailSent) {
        return NextResponse.json({ 
          success: true, 
          message: 'Email di verifica inviata con successo',
          debug: { code: verificationCode } // Sempre incluso per debug
        })
      } else {
        return NextResponse.json(
          { error: 'Errore nell\'invio dell\'email di verifica' },
          { status: 500 }
        )
      }
    }

    if (action === 'verify') {
      const { email, code } = body
      console.log(`Verifica codice per ${email}: ${code}`)
      
      const storedData = verificationCodes.get(email)
      
      if (!storedData) {
        console.log(`Nessun codice trovato per ${email}`)
        return NextResponse.json(
          { error: 'Codice non trovato o scaduto' },
          { status: 400 }
        )
      }

      console.log(`Codice memorizzato per ${email}: ${storedData.code}`)

      // Verifica se il codice è scaduto (10 minuti)
      const now = Date.now()
      const codeAge = now - storedData.timestamp
      const tenMinutes = 10 * 60 * 1000

      if (codeAge > tenMinutes) {
        verificationCodes.delete(email)
        return NextResponse.json(
          { error: 'Codice di verifica scaduto' },
          { status: 400 }
        )
      }

      if (storedData.code === code) {
        // Codice corretto, rimuovi dalla memoria
        verificationCodes.delete(email)
        console.log(`Verifica completata per ${email}`)
        
        // Salva l'utente nel localStorage (in produzione andrebbe nel database)
        return NextResponse.json({ 
          success: true, 
          message: 'Verifica completata con successo',
          user: { email, verified: true }
        })
      } else {
        console.log(`Codice non corretto per ${email}. Inserito: ${code}, Atteso: ${storedData.code}`)
        return NextResponse.json(
          { error: 'Codice di verifica non corretto' },
          { status: 400 }
        )
      }
    }

    if (action === 'login') {
      const { email, password } = body
      
      // Per ora, accetta qualsiasi email/password
      // In produzione, verificheresti nel database
      if (email && password) {
        return NextResponse.json({ 
          success: true, 
          message: 'Login effettuato con successo',
          user: { email, name: email.split('@')[0] }
        })
      } else {
        return NextResponse.json(
          { error: 'Credenziali non valide' },
          { status: 401 }
        )
      }
    }

    if (action === 'forgot-password') {
      const { email, motherMaidenName } = body
      
      // Per ora, accetta qualsiasi email
      // In produzione, verificheresti nel database
      if (email) {
        const resetCode = generateVerificationCode()
        const timestamp = Date.now()
        
        resetCodes.set(email, { code: resetCode, timestamp })
        
        const emailSent = await sendPasswordResetEmail(email, resetCode)
        
        if (emailSent) {
          return NextResponse.json({ 
            success: true, 
            message: 'Email di recupero inviata con successo',
            debug: { code: resetCode } // Solo per debug, rimuovere in produzione
          })
        } else {
          return NextResponse.json(
            { error: 'Errore nell\'invio dell\'email di recupero' },
            { status: 500 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Email non trovata' },
          { status: 404 }
        )
      }
    }

    if (action === 'reset-password') {
      const { email, code, newPassword } = body
      const storedData = resetCodes.get(email)
      
      if (!storedData) {
        return NextResponse.json(
          { error: 'Codice non trovato o scaduto' },
          { status: 400 }
        )
      }

      // Verifica se il codice è scaduto (10 minuti)
      const now = Date.now()
      const codeAge = now - storedData.timestamp
      const tenMinutes = 10 * 60 * 1000

      if (codeAge > tenMinutes) {
        resetCodes.delete(email)
        return NextResponse.json(
          { error: 'Codice di recupero scaduto' },
          { status: 400 }
        )
      }

      if (storedData.code === code) {
        // Codice corretto, rimuovi dalla memoria
        resetCodes.delete(email)
        
        // In produzione, aggiorneresti la password nel database
        return NextResponse.json({ 
          success: true, 
          message: 'Password aggiornata con successo' 
        })
      } else {
        return NextResponse.json(
          { error: 'Codice di recupero non corretto' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Azione non valida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Errore nell\'API auth:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 