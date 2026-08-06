import type { ReactNode } from "react"

/**
 * Admin shell: keeps text/inputs readable in both light and dark themes.
 * Site-wide dark mode sets a light foreground; without this, white cards
 * inherit white text and become unreadable.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin-panel">{children}</div>
}
