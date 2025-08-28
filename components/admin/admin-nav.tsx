"use client"

import React from 'react'
import { useAuth } from "@clerk/nextjs"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Home, Users, Image as ImageIcon, FileText, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const adminRoutes = [
  {
    href: "/admin",
    icon: BarChart3,
    label: "Dashboard",
    description: "Panoramica generale"
  },
  {
    href: "/admin/accommodations",
    icon: Home,
    label: "Accommodations",
    description: "Gestisci le tue strutture"
  },
  {
    href: "/admin/images",
    icon: ImageIcon,
    label: "Galleria Immagini",
    description: "Gestisci tutte le immagini"
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "Utenti",
    description: "Gestione utenti"
  },
  {
    href: "/admin/content",
    icon: FileText,
    label: "Contenuti",
    description: "Gestisci contenuti del sito"
  },
  {
    href: "/admin/settings",
    icon: Settings,
    label: "Impostazioni",
    description: "Configurazione sistema"
  }
]

interface AdminNavProps {
  className?: string
}

export function AdminNav({ className }: AdminNavProps) {
  const { userId, isSignedIn } = useAuth()
  const pathname = usePathname()

  if (!isSignedIn) {
    return null
  }

  return (
    <nav className={cn("space-y-2", className)}>
      {adminRoutes.map((route) => {
        const isActive = pathname === route.href
        const Icon = route.icon

        return (
          <Link key={route.href} href={route.href}>
            <Card className={cn(
              "transition-all hover:shadow-md cursor-pointer",
              isActive && "bg-primary/5 border-primary"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isActive ? "bg-primary text-primary-foreground" : "bg-gray-100"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{route.label}</h3>
                    <p className="text-sm text-gray-600">{route.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminHeader() {
  const { user } = useAuth()

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Pannello Amministrazione</h1>
            <p className="text-gray-600">Gestisci il tuo sito web</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user?.fullName || user?.emailAddresses[0]?.emailAddress}</p>
              <p className="text-sm text-gray-600">Amministratore</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Torna al Sito
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
