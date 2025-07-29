import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

// Inizializza il client Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Webhook endpoint per gestire gli eventi di Clerk
export async function POST(req: Request) {
  // Verifica che sia una richiesta POST
  if (req.method !== 'POST') {
    return new NextResponse('Method not allowed', { status: 405 })
  }

  // Ottieni l'header del webhook
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Se non ci sono header di Svix, restituisci un errore
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Ottieni il body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Crea una nuova istanza di Svix
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent

  // Verifica la firma del webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400
    })
  }

  // Ottieni l'ID e il tipo dell'evento
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook received!`)
  console.log(`ID: ${id}`)
  console.log(`Type: ${eventType}`)

  // Gestisci i diversi tipi di eventi
  switch (eventType) {
    case 'user.created':
      console.log('Nuovo utente registrato:', evt.data)
      try {
        const userData = evt.data as any
        await convex.mutation(api.users.createUser, {
          clerkId: userData.id,
          email: userData.email_addresses?.[0]?.email_address || '',
          firstName: userData.first_name,
          lastName: userData.last_name,
          phone: userData.phone_numbers?.[0]?.phone_number,
          role: 'user'
        })
        console.log('✅ Utente salvato con successo in Convex')
      } catch (error) {
        console.error('❌ Errore nel salvare l\'utente in Convex:', error)
      }
      break
      
    case 'user.updated':
      console.log('Utente aggiornato:', evt.data)
      try {
        const userData = evt.data as any
        await convex.mutation(api.users.updateUser, {
          clerkId: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          phone: userData.phone_numbers?.[0]?.phone_number,
          role: 'user'
        })
        console.log('✅ Utente aggiornato con successo in Convex')
      } catch (error) {
        console.error('❌ Errore nell\'aggiornare l\'utente in Convex:', error)
      }
      break
      
    case 'user.deleted':
      console.log('Utente eliminato:', evt.data)
      try {
        const userData = evt.data as any
        await convex.mutation(api.users.deleteUser, {
          clerkId: userData.id
        })
        console.log('✅ Utente eliminato con successo da Convex')
      } catch (error) {
        console.error('❌ Errore nell\'eliminare l\'utente da Convex:', error)
      }
      break
      
    case 'session.created':
      console.log('Nuova sessione creata:', evt.data)
      break
      
    case 'session.ended':
      console.log('Sessione terminata:', evt.data)
      break
      
    default:
      console.log(`Evento non gestito: ${eventType}`)
  }

  return NextResponse.json({ success: true })
} 