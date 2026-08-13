import { properties, propertySlugs } from "./properties-data"

const NAME_TO_SLUG: Record<string, string> = {
  "Lucas Suite": "lucas-suite",
  "Lucas Rooftop": "lucas-rooftop",
  "Lucas Cottage": "lucas-cottage",
}

export function isPropertySlug(value: string): boolean {
  return propertySlugs.includes(value)
}

export function getPropertyBySlug(slug: string) {
  return properties[slug] ?? null
}

export function nameToPropertySlug(name: string): string | null {
  if (NAME_TO_SLUG[name]) return NAME_TO_SLUG[name]
  const normalized = name.toLowerCase().replace(/\s+/g, "-")
  return isPropertySlug(normalized) ? normalized : null
}

export function getPropertyBookingUrl(slug: string, checkIn?: string, checkOut?: string): string {
  const params = new URLSearchParams()
  if (checkIn) params.set("checkIn", checkIn)
  if (checkOut) params.set("checkOut", checkOut)
  const query = params.toString()
  return `/${slug}/prenota${query ? `?${query}` : ""}`
}

export function getPropertyPageUrl(slug: string): string {
  return `/${slug}`
}
