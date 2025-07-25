"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs"

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerkAuth()

  const login = () => {
    // Clerk gestisce automaticamente il login
  }

  const logout = () => {
    signOut()
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