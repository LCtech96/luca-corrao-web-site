import type { MetadataRoute } from "next"

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, "")

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`

  return "http://localhost:3000"
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl()
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${base}${path}`
}

export function metadataBaseUrl(): URL {
  return new URL(getSiteUrl())
}

export function defaultRobotsRules(): NonNullable<MetadataRoute.Robots["rules"]> {
  return [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/profile/", "/dashboard/", "/auth/"],
    },
  ]
}

