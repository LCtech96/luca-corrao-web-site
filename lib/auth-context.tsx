"use client"

import { createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Fallback authentication state when Clerk is not configured
  const user = null
  const isSignedIn = false

  const login = () => {
    // Fallback login logic
    console.log('Login not configured - please set up Clerk authentication')
  }

  const logout = () => {
    // Fallback logout logic
    console.log('Logout not configured - please set up Clerk authentication')
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