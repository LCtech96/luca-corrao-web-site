import { google } from 'googleapis'
import { createAuthenticatedClient } from './google-auth'

const SPREADSHEET_ID = '18X9VQOYNtX-qAyHAFwkCKALuufK3MHP-ShmZ7u074X4'
const STRUCTURES_SHEET = 'Structures'

export interface Structure {
  id: string
  name: string
  description: string
  address: string
  gpsCoordinates?: string
  rating: number
  mainImage: string
  images: string[]
  owner: string
  ownerEmail: string
  createdAt: string
  isOwner: boolean
}

// Recupera tutte le strutture dalla spreadsheet
export async function getAllStructures(accessToken: string): Promise<Structure[]> {
  try {
    const sheets = createAuthenticatedClient(accessToken)
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${STRUCTURES_SHEET}!A:Z`,
    })

    const rows = response.data.values || []
    
    if (rows.length === 0) {
      return []
    }

    // Converti le righe in oggetti Structure
    const structures: Structure[] = rows.slice(1).map((row: any) => ({
      id: row[0] || '',
      name: row[1] || '',
      description: row[2] || '',
      address: row[3] || '',
      gpsCoordinates: row[4] || '',
      rating: parseFloat(row[5]) || 0,
      mainImage: row[6] || '',
      images: row[7] ? row[7].split(',').map((img: string) => img.trim()) : [],
      owner: row[8] || '',
      ownerEmail: row[9] || '',
      createdAt: row[10] || '',
      isOwner: false // Sarà impostato dal frontend
    }))

    return structures
  } catch (error) {
    console.error('Errore nel recupero strutture:', error)
    throw error
  }
}

// Aggiungi una nuova struttura
export async function addStructure(
  accessToken: string, 
  structure: Omit<Structure, 'id' | 'createdAt' | 'isOwner'>
): Promise<Structure> {
  try {
    const sheets = createAuthenticatedClient(accessToken)
    
    const newStructure = {
      ...structure,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isOwner: true
    }

    const rowData = [
      newStructure.id,
      newStructure.name,
      newStructure.description,
      newStructure.address,
      newStructure.gpsCoordinates || '',
      newStructure.rating.toString(),
      newStructure.mainImage,
      newStructure.images.join(','),
      newStructure.owner,
      newStructure.ownerEmail,
      newStructure.createdAt
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${STRUCTURES_SHEET}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    })

    return newStructure
  } catch (error) {
    console.error('Errore nell\'aggiunta struttura:', error)
    throw error
  }
}

// Aggiorna una struttura esistente
export async function updateStructure(
  accessToken: string,
  structureId: string,
  updates: Partial<Structure>
): Promise<void> {
  try {
    const sheets = createAuthenticatedClient(accessToken)
    
    // Prima trova la riga della struttura
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${STRUCTURES_SHEET}!A:Z`,
    })

    const rows = response.data.values || []
    const structureIndex = rows.findIndex((row: any) => row[0] === structureId)
    
    if (structureIndex === -1) {
      throw new Error('Struttura non trovata')
    }

    // Aggiorna i campi modificati
    const rowIndex = structureIndex + 1 // +1 perché l'index parte da 0
    const currentRow = rows[structureIndex]
    
    const updatedRow = [
      currentRow[0], // id
      updates.name ?? currentRow[1],
      updates.description ?? currentRow[2],
      updates.address ?? currentRow[3],
      updates.gpsCoordinates ?? currentRow[4],
      (updates.rating ?? currentRow[5]).toString(),
      updates.mainImage ?? currentRow[6],
      updates.images ? updates.images.join(',') : currentRow[7],
      currentRow[8], // owner (non modificabile)
      currentRow[9], // ownerEmail (non modificabile)
      currentRow[10] // createdAt (non modificabile)
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${STRUCTURES_SHEET}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [updatedRow]
      }
    })
  } catch (error) {
    console.error('Errore nell\'aggiornamento struttura:', error)
    throw error
  }
}

// Elimina una struttura
export async function deleteStructure(
  accessToken: string,
  structureId: string
): Promise<void> {
  try {
    const sheets = createAuthenticatedClient(accessToken)
    
    // Prima trova la riga della struttura
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${STRUCTURES_SHEET}!A:Z`,
    })

    const rows = response.data.values || []
    const structureIndex = rows.findIndex((row: any) => row[0] === structureId)
    
    if (structureIndex === -1) {
      throw new Error('Struttura non trovata')
    }

    // Elimina la riga
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assumiamo che sia il primo sheet
                dimension: 'ROWS',
                startIndex: structureIndex,
                endIndex: structureIndex + 1
              }
            }
          }
        ]
      }
    })
  } catch (error) {
    console.error('Errore nell\'eliminazione struttura:', error)
    throw error
  }
}

// Verifica se l'utente è proprietario della struttura
export function isStructureOwner(structure: Structure, userEmail: string): boolean {
  return structure.ownerEmail === userEmail
}

// Filtra strutture per proprietario
export function filterStructuresByOwner(structures: Structure[], userEmail: string): Structure[] {
  return structures.map(structure => ({
    ...structure,
    isOwner: isStructureOwner(structure, userEmail)
  }))
} 