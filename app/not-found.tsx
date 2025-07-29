// app/not-found.tsx

import Link from 'next/link'



export default function NotFound() {

  return (

    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>

      <h1>404 - Pagina Non Trovata</h1>

      <p>La pagina che stai cercando non esiste.</p>

      

      {/* La riga corretta è questa: */}

      <Link href="/">Torna alla Home</Link>

    </div>

  )

}

// Aggiungo questo commento per forzare un nuovo deploy