export const ADMIN_EMAILS = [
  "lucacorrao1996@gmail.com",
  "lucacorrao96@outlook.it",
  "luca@metatech.dev",
  "lucacorrao1996@outlook.com",
  "luca@lucacorrao.com",
]

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

