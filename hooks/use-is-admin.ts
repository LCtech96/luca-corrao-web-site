'use client'

import { useAuth } from './use-auth'
import { isAdminEmail } from '@/lib/admin'

export function useIsAdmin() {
  const { user, loading } = useAuth()
  
  const isAdmin = isAdminEmail(user?.email)
  
  return { isAdmin, loading }
}

