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
  // Fallback values when Clerk is not available
  let user = null
  let isSignedIn = false
  let signOut = () => Promise.resolve()

  try {
    // Try to use Clerk hooks, but handle the case when Clerk is not available
    const clerkUser = useUser()
    const clerk = useClerk()
    
    user = clerkUser.user
    isSignedIn = clerkUser.isSignedIn || false
    signOut = clerk.signOut
  } catch (error) {
    // Clerk is not available, use fallback values
    console.log('Clerk not available, using fallback authentication')
  }

  const login = () => {
    // Clerk handles login through its own UI components
    console.log('Use Clerk SignIn component for login')
  }

  const logout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error during logout:', error)
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