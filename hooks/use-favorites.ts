'use client'

import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('property_favorites')
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('property_favorites', JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }
  }, [favorites, loading])

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId)
      } else {
        return [...prev, propertyId]
      }
    })
  }

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId)
  }

  const addFavorite = (propertyId: string) => {
    if (!favorites.includes(propertyId)) {
      setFavorites(prev => [...prev, propertyId])
    }
  }

  const removeFavorite = (propertyId: string) => {
    setFavorites(prev => prev.filter(id => id !== propertyId))
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    loading,
    count: favorites.length
  }
}

