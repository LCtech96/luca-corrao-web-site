"use client"

import { useEffect, useState } from 'react'
import { getAllStructures, subscribeToStructures, type Structure } from '@/lib/supabase/structures-service'

export function useStructures() {
  const [structures, setStructures] = useState<Structure[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchStructures() {
      try {
        setIsLoading(true)
        const data = await getAllStructures()
        if (mounted) {
          // Only show approved structures
          const approved = data.filter(s => s.isActive && s.status === 'approved')
          setStructures(approved.length > 0 ? approved : null)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch structures'))
          setStructures(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchStructures()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStructures((data) => {
      if (mounted) {
        const approved = data.filter(s => s.isActive && s.status === 'approved')
        setStructures(approved.length > 0 ? approved : null)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return { structures, isLoading, error }
}

