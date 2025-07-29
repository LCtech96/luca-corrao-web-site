# Configurazione Clerk per Autenticazione

## Panoramica

Questo progetto utilizza [Clerk](https://clerk.com) per gestire l'autenticazione degli utenti. Clerk fornisce un sistema di autenticazione completo e sicuro con supporto per:

- Registrazione utenti
- Login/Logout
- Gestione sessioni
- Autenticazione sociale (Google, Facebook, etc.)
- Protezione delle route
- Gestione profili utente

## Configurazione

### 1. Variabili d'Ambiente

Assicurati che il file `.env.local` contenga le seguenti variabili:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
```

### 2. Setup Clerk Dashboard

1. Vai su [Clerk Dashboard](https://dashboard.clerk.com)
2. Crea un nuovo progetto
3. Copia le chiavi API nel file `.env.local`
4. Configura i domini autorizzati nelle impostazioni del progetto

## Componenti Implementati

### 1. Layout con ClerkProvider

Il file `app/layout.tsx` è configurato per utilizzare Clerk:

```tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <html>
      <body>
        {clerkPublishableKey ? (
          <ClerkProvider publishableKey={clerkPublishableKey}>
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
```

### 2. Pagine di Autenticazione

#### Registrazione (`/sign-up`)
- **File**: `app/sign-up/[[...sign-up]]/page.tsx`
- **Componente**: `SignUp` di Clerk
- **Funzionalità**: Registrazione utenti con validazione email

#### Login (`/sign-in`)
- **File**: `app/sign-in/[[...sign-in]]/page.tsx`
- **Componente**: `SignIn` di Clerk
- **Funzionalità**: Accesso utenti con supporto social login

### 3. Dashboard Protetto

#### Dashboard (`/dashboard`)
- **File**: `app/dashboard/page.tsx`
- **Protezione**: Richiede autenticazione
- **Funzionalità**: Area riservata per utenti autenticati

```tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    // Contenuto del dashboard
  )
}
```

### 4. Componenti UI

#### ClerkSignIn (`components/clerk-sign-in.tsx`)
- Modal per il login
- Styling personalizzato con tema dell'applicazione
- Integrazione con il sistema di navigazione

#### ClerkSignUp (`components/clerk-sign-up.tsx`)
- Modal per la registrazione
- Campo personalizzato per "Cognome della madre"
- Validazione e gestione errori

### 5. Navigation Bar

La navigation bar (`components/navigation-bar.tsx`) include:
- Pulsanti per login/registrazione
- UserButton per utenti autenticati
- Gestione modali per autenticazione

## Utilizzo

### 1. Registrazione Utente

```tsx
import { SignUp } from "@clerk/nextjs"

<SignUp 
  afterSignUpUrl="/dashboard"
  signInUrl="/sign-in"
/>
```

### 2. Login Utente

```tsx
import { SignIn } from "@clerk/nextjs"

<SignIn 
  afterSignInUrl="/dashboard"
  signUpUrl="/sign-up"
/>
```

### 3. Protezione Route

```tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect("/sign-in")
  }

  return <div>Contenuto protetto</div>
}
```

### 4. Hook per Dati Utente

```tsx
import { useUser } from "@clerk/nextjs"

export function UserProfile() {
  const { user, isSignedIn } = useUser()

  if (!isSignedIn) {
    return <div>Non autenticato</div>
  }

  return <div>Benvenuto {user.firstName}!</div>
}
```

### 5. Logout

```tsx
import { useClerk } from "@clerk/nextjs"

export function LogoutButton() {
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut()
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

## Personalizzazione

### 1. Styling

Clerk supporta la personalizzazione dell'aspetto tramite la prop `appearance`:

```tsx
<SignIn
  appearance={{
    elements: {
      formButtonPrimary: "bg-gradient-to-r from-amber-600 to-orange-600",
      card: "shadow-xl border-0",
      headerTitle: "text-2xl font-bold text-gray-900",
    }
  }}
/>
```

### 2. Campi Personalizzati

Per aggiungere campi personalizzati (come il cognome della madre):

```tsx
// Nel componente di registrazione
const [motherMaidenName, setMotherMaidenName] = useState("")

// Salvataggio dopo la registrazione
const handleSignUpComplete = async (userId: string) => {
  // Salva i dati personalizzati
  localStorage.setItem(`motherMaidenName_${userId}`, motherMaidenName)
}
```

## Sicurezza

### 1. Validazione Server-Side

```tsx
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Logica protetta
}
```

### 2. Middleware

Il file `middleware.ts` è configurato per proteggere automaticamente le route:

```tsx
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in", 
    "/sign-up",
    "/api/auth",
    "/api/auth/google",
    "/api/auth/google/callback",
    "/api/chat",
    "/api/reviews",
    "/api/spreadsheet",
    "/api/structures"
  ],
  ignoredRoutes: ["/api/public"]
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
```

## Troubleshooting

### 1. Errore "useUser can only be used within ClerkProvider"

**Soluzione**: Assicurati che il componente sia avvolto da `ClerkProvider`:

```tsx
// ✅ Corretto
<ClerkProvider publishableKey={key}>
  <ComponentWithUseUser />
</ClerkProvider>

// ❌ Errato
<ComponentWithUseUser />
```

### 2. Errore di Build

**Soluzione**: Verifica che le variabili d'ambiente siano configurate correttamente:

```bash
npm run build
```

### 3. Problemi di Styling

**Soluzione**: Verifica che le classi CSS siano applicate correttamente:

```tsx
appearance={{
  elements: {
    formButtonPrimary: "your-custom-classes",
  }
}}
```

## Deployment

### 1. Vercel

1. Aggiungi le variabili d'ambiente nel dashboard Vercel
2. Configura i domini autorizzati in Clerk Dashboard
3. Deploy dell'applicazione

### 2. Altri Provider

1. Configura le variabili d'ambiente nel tuo provider
2. Aggiorna i domini autorizzati in Clerk
3. Deploy dell'applicazione

## Risorse Utili

- [Documentazione Clerk](https://clerk.com/docs)
- [Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Styling Guide](https://clerk.com/docs/styling/customization)
- [API Reference](https://clerk.com/docs/reference)

## Note

- Clerk gestisce automaticamente la sicurezza e la validazione
- Le sessioni sono gestite in modo sicuro
- Supporto per autenticazione sociale integrato
- Dashboard per gestire utenti e impostazioni 