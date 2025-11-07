"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    try {
      // Set up auth state listener if needed
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        // Handle auth state changes if needed
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      // Supabase not configured yet, that's okay
      console.warn('Supabase auth listener could not be set up:', error)
    }
  }, [supabase])

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used within SupabaseProvider')
  }
  return context
}
