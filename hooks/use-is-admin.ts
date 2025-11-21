'use client'

import { useAuth } from './use-auth'

const ADMIN_EMAILS = [
  'lucacorrao1996@gmail.com',
  'lucacorrao96@outlook.it',
  'luca@metatech.dev',
  'lucacorrao1996@outlook.com',
  'luca@lucacorrao.com'
]

export function useIsAdmin() {
  const { user, loading } = useAuth()
  
  const isAdmin = user ? ADMIN_EMAILS.includes(user.email || '') : false
  
  return { isAdmin, loading }
}

