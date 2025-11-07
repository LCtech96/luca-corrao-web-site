"use client"

import { useEffect, useState } from 'react'
import { getAllAccommodations, subscribeToAccommodations, type Accommodation } from '@/lib/supabase/accommodations-service'

export function useAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchAccommodations() {
      try {
        setIsLoading(true)
        const data = await getAllAccommodations()
        if (mounted) {
          // Se non ci sono dati, mantieni null invece di array vuoto
          // Questo permette al componente di usare i dati fallback
          setAccommodations(data.length > 0 ? data : null)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch accommodations'))
          setAccommodations(null) // Usa fallback in caso di errore
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAccommodations()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAccommodations((data) => {
      if (mounted) {
        setAccommodations(data.length > 0 ? data : null)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return { accommodations, isLoading, error }
}
