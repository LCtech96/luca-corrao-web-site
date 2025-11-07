import { createClient } from './client'

// Sign in with Google
export async function signInWithGoogle() {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  
  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
  
  return data
}

// Sign in with Facebook
export async function signInWithFacebook() {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    console.error('Error signing in with Facebook:', error)
    throw error
  }
  
  return data
}

// Sign in with Ethereum wallet (MetaMask)
export async function signInWithMetaMask() {
  const supabase = createClient()
  
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      const address = accounts[0]
      const message = `Sign in to Luca Corrao Website\n\nWallet: ${address}\nNonce: ${Date.now()}`
      
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })
      
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'ethereum' as any,
        token: signature,
        nonce: message,
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error signing in with MetaMask:', error)
      throw error
    }
  } else {
    throw new Error('MetaMask non installato. Visita https://metamask.io')
  }
}

// Sign in with Phantom wallet (Solana)
export async function signInWithPhantom() {
  if (typeof window !== 'undefined' && (window as any).phantom?.solana) {
    try {
      const resp = await (window as any).phantom.solana.connect()
      const publicKey = resp.publicKey.toString()
      
      // Phantom richiede un messaggio in formato specifico
      const message = new TextEncoder().encode(
        `Sign in to Luca Corrao Website\n\nWallet: ${publicKey}\nNonce: ${Date.now()}`
      )
      
      const { signature } = await (window as any).phantom.solana.signMessage(message)
      
      // Per Phantom/Solana, potremmo dover gestire l'auth in modo custom
      // Questo è un esempio semplificato
      throw new Error('Phantom authentication coming soon!')
      
    } catch (error) {
      console.error('Error signing in with Phantom:', error)
      throw error
    }
  } else {
    throw new Error('Phantom non installato. Visita https://phantom.app')
  }
}

// Sign in with WalletConnect
export async function signInWithWalletConnect() {
  throw new Error('WalletConnect coming soon! Usa MetaMask per ora.')
}

// Sign in with Coinbase Wallet
export async function signInWithCoinbase() {
  if (typeof window !== 'undefined' && (window as any).coinbaseWalletExtension) {
    throw new Error('Coinbase Wallet coming soon! Usa MetaMask per ora.')
  } else {
    throw new Error('Coinbase Wallet non installato.')
  }
}

// Sign in with Trust Wallet
export async function signInWithTrust() {
  throw new Error('Trust Wallet coming soon! Usa MetaMask per ora.')
}

// Sign out
export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  
  return user
}

// Get current session
export async function getCurrentSession() {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

// Sign up with email (opzionale - per registrazione tradizionale)
export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    console.error('Error signing up:', error)
    throw error
  }
  
  // Se la registrazione richiede verifica email
  if (data.user && !data.session) {
    return {
      ...data,
      needsEmailVerification: true,
      message: 'Controlla la tua email per verificare l\'account prima di fare login.'
    }
  }
  
  return data
}

// Sign in with email
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error('Error signing in:', error)
    throw error
  }
  
  return data
}

// Send password reset email
export async function sendPasswordResetEmail(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) throw error
  return data
}

// Update password (after reset)
export async function updatePassword(newPassword: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
  return data
}

// Resend verification email
export async function resendVerificationEmail(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    }
  })

  if (error) throw error
  return data
}

// Enable 2FA for user
export async function enable2FA(phoneNumber: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'phone',
    phone: phoneNumber,
  })

  if (error) throw error
  return data
}

// Verify 2FA code
export async function verify2FACode(factorId: string, code: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.mfa.challenge({
    factorId: factorId,
  })

  if (error) throw error

  const challengeId = data.id

  const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
    factorId: factorId,
    challengeId: challengeId,
    code: code,
  })

  if (verifyError) throw verifyError
  return verifyData
}

// Disable 2FA
export async function disable2FA(factorId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.mfa.unenroll({
    factorId: factorId,
  })

  if (error) throw error
  return data
}

// Get user's 2FA factors
export async function get2FAFactors() {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.mfa.listFactors()

  if (error) throw error
  return data
}

