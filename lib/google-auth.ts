import { google } from 'googleapis'

// Configurazione Google OAuth
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '42904699184-itfale5a6vvh6r9i1p8m5i7v77md8nt4.apps.googleusercontent.com'
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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'
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

// Scopes per Google Sheets
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.email'
]

// Crea OAuth2 client
export function createOAuth2Client() {
  return new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  )
}

// Genera URL di autorizzazione
export function generateAuthUrl(): string {
  const oauth2Client = createOAuth2Client()
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  })
}

// Scambia codice con token
export async function getTokensFromCode(code: string) {
  const oauth2Client = createOAuth2Client()
  
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

// Crea client autenticato per Google Sheets
export function createAuthenticatedClient(accessToken: string) {
  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials({ access_token: accessToken })
  
  return google.sheets({ version: 'v4', auth: oauth2Client })
}

// Verifica se il token è ancora valido
export async function isTokenValid(accessToken: string): Promise<boolean> {
  try {
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({ access_token: accessToken })
    
    // Prova a fare una chiamata di test
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    await oauth2.userinfo.get()
    
    return true
  } catch (error) {
    console.error('Token non valido:', error)
    return false
  }
} 