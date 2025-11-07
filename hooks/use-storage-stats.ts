'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface StorageStats {
  totalFiles: number
  totalSize: number
  totalSizeMB: number
  categories: Record<string, number>
  loading: boolean
  error: string | null
}

export function useStorageStats(userId?: string) {
  const [stats, setStats] = useState<StorageStats>({
    totalFiles: 0,
    totalSize: 0,
    totalSizeMB: 0,
    categories: {},
    loading: true,
    error: null
  })

  useEffect(() => {
    fetchStats()
  }, [userId])

  const fetchStats = async () => {
    try {
      const supabase = createClient()
      
      // Get list of files from accommodations-images bucket
      const { data: files, error } = await supabase
        .storage
        .from('accommodations-images')
        .list()

      if (error) {
        throw error
      }

      // Filter by userId if provided
      let filteredFiles = files || []
      if (userId) {
        filteredFiles = files?.filter(file => 
          file.owner === userId || file.metadata?.owner === userId
        ) || []
      }

      // Calculate total size
      const totalSize = filteredFiles.reduce((acc, file) => {
        return acc + (file.metadata?.size || 0)
      }, 0)

      // Calculate categories (based on folder structure or metadata)
      const categories: Record<string, number> = {}
      filteredFiles.forEach(file => {
        const category = file.metadata?.category || 'general'
        categories[category] = (categories[category] || 0) + 1
      })

      setStats({
        totalFiles: filteredFiles.length,
        totalSize,
        totalSizeMB: parseFloat((totalSize / (1024 * 1024)).toFixed(2)),
        categories,
        loading: false,
        error: null
      })
    } catch (error: any) {
      console.error('Error fetching storage stats:', error)
      setStats({
        totalFiles: 0,
        totalSize: 0,
        totalSizeMB: 0,
        categories: {},
        loading: false,
        error: error.message || 'Failed to fetch storage stats'
      })
    }
  }

  return { stats, refetch: fetchStats }
}
