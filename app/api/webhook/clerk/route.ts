import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

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
        await UserService.createUser({
          id: userData.id,
          email: userData.email_addresses?.[0]?.email_address || '',
          firstName: userData.first_name,
          lastName: userData.last_name,
          emailVerified: userData.email_addresses?.[0]?.verification?.status === 'verified',
          phoneNumber: userData.phone_numbers?.[0]?.phone_number,
          imageUrl: userData.image_url,
          publicMetadata: userData.public_metadata,
          privateMetadata: userData.private_metadata,
          unsafeMetadata: userData.unsafe_metadata
        })
        console.log('✅ Utente salvato con successo nel database locale')
      } catch (error) {
        console.error('❌ Errore nel salvare l\'utente:', error)
      }
      break
      
    case 'user.updated':
      console.log('Utente aggiornato:', evt.data)
      try {
        const userData = evt.data as any
        await UserService.updateUser(userData.id, {
          email: userData.email_addresses?.[0]?.email_address || '',
          firstName: userData.first_name,
          lastName: userData.last_name,
          emailVerified: userData.email_addresses?.[0]?.verification?.status === 'verified',
          phoneNumber: userData.phone_numbers?.[0]?.phone_number,
          imageUrl: userData.image_url,
          publicMetadata: userData.public_metadata,
          privateMetadata: userData.private_metadata,
          unsafeMetadata: userData.unsafe_metadata
        })
        console.log('✅ Utente aggiornato con successo nel database locale')
      } catch (error) {
        console.error('❌ Errore nell\'aggiornare l\'utente:', error)
      }
      break
      
    case 'user.deleted':
      console.log('Utente eliminato:', evt.data)
      try {
        const userData = evt.data as any
        await UserService.deleteUser(userData.id)
        console.log('✅ Utente eliminato con successo dal database locale')
      } catch (error) {
        console.error('❌ Errore nell\'eliminare l\'utente:', error)
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