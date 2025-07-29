// app/not-found.tsx

import Link from 'next/link'

// Rimuovi 'use client' perché non c'è interattività
export default function NotFound() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>404 - Pagina Non Trovata</h1>
      <p>La pagina che stai cercando non esiste.</p>
      <Link href="/">Torna alla Home</PageNotFound>
    </div>
  )
}