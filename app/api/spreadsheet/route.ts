import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createAuthenticatedClient, isTokenValid } from '@/lib/google-auth'

// Configurazione Google Sheets API
const SPREADSHEET_ID = '18X9VQOYNtX-qAyHAFwkCKALuufK3MHP-ShmZ7u074X4'

// Funzione per ottenere client autenticato
async function getAuthenticatedSheetsClient(accessToken: string) {
  if (!accessToken) {
    throw new Error('Token di accesso mancante')
  }

  // Verifica se il token è ancora valido
  const isValid = await isTokenValid(accessToken)
  if (!isValid) {
    throw new Error('Token di accesso scaduto o non valido')
  }

  return createAuthenticatedClient(accessToken)
}

// GET - Recupera dati dalla spreadsheet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sheetName = searchParams.get('sheet') || 'Users' // Default sheet
    const range = searchParams.get('range') || 'A:Z' // Default range
    const accessToken = searchParams.get('accessToken')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    const sheets = await getAuthenticatedSheetsClient(accessToken)

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
    })

    const rows = response.data.values || []
    
    if (rows.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // Converti in oggetti se ci sono headers
    const headers = rows[0]
    const data = rows.slice(1).map((row: any) => {
      const obj: any = {}
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || ''
      })
      return obj
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Errore nel recupero dati:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dati dalla spreadsheet' },
      { status: 500 }
    )
  }
}

// POST - Salva dati nella spreadsheet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, sheetName = 'Users', action = 'append', accessToken } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    const sheets = await getAuthenticatedSheetsClient(accessToken)

    let response

    if (action === 'append') {
      // Aggiungi nuova riga
      response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [Object.values(data)]
        }
      })
    } else if (action === 'update') {
      // Aggiorna riga esistente
      const { rowIndex } = body
      response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [Object.values(data)]
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Dati salvati con successo',
      updatedRange: (response?.data as any)?.updates?.updatedRange 
    })
  } catch (error) {
    console.error('Errore nel salvataggio dati:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio dati nella spreadsheet' },
      { status: 500 }
    )
  }
}

// PUT - Aggiorna dati nella spreadsheet
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, sheetName = 'Users', rowIndex, accessToken } = body

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    const sheets = await getAuthenticatedSheetsClient(accessToken)

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [Object.values(data)]
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Dati aggiornati con successo',
      updatedRange: response.data.updatedRange 
    })
  } catch (error) {
    console.error('Errore nell\'aggiornamento dati:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento dati nella spreadsheet' },
      { status: 500 }
    )
  }
}

// DELETE - Elimina riga dalla spreadsheet
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sheetName = searchParams.get('sheet') || 'Users'
    const rowIndex = searchParams.get('rowIndex')
    const accessToken = searchParams.get('accessToken')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token di accesso richiesto' },
        { status: 401 }
      )
    }

    if (!rowIndex) {
      return NextResponse.json(
        { error: 'rowIndex è richiesto' },
        { status: 400 }
      )
    }

    const sheets = await getAuthenticatedSheetsClient(accessToken)

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assumiamo che sia il primo sheet
                dimension: 'ROWS',
                startIndex: parseInt(rowIndex) - 1,
                endIndex: parseInt(rowIndex)
              }
            }
          }
        ]
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Riga eliminata con successo' 
    })
  } catch (error) {
    console.error('Errore nell\'eliminazione riga:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione della riga dalla spreadsheet' },
      { status: 500 }
    )
  }
} 