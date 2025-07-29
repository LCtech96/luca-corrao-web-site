"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()

  const login = () => {
    // Redirect to sign-in page
    window.location.href = '/sign-in'
  }

  const logout = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Errore durante il logout:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: isSignedIn || false, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 