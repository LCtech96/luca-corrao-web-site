import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"
import { propertySlugs } from "@/lib/properties-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/esplora-le-strutture"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/data-deletion"), lastModified: now, changeFrequency: "yearly", priority: 0.1 },
    { url: absoluteUrl("/host"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = propertySlugs.map((slug) => ({
    url: absoluteUrl(`/property/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...propertyRoutes]
}

