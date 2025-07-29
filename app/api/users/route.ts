import { NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

// API per ottenere tutti gli utenti registrati
export async function GET() {
  try {
    const users = await UserService.getAllUsers()
    const stats = await UserService.getUserStats()
    
    return NextResponse.json({
      success: true,
      data: {
        users,
        stats
      }
    })
  } catch (error) {
    console.error('Errore nel recuperare gli utenti:', error)
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// API per ottenere un utente specifico
export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID utente richiesto' },
        { status: 400 }
      )
    }
    
    const user = await UserService.getUserById(id)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utente non trovato' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Errore nel recuperare l\'utente:', error)
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 