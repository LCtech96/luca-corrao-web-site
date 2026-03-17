import type { MetadataRoute } from "next"
import { absoluteUrl, defaultRobotsRules, getSiteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: defaultRobotsRules(),
    sitemap: absoluteUrl("/sitemap.xml"),
    host: getSiteUrl(),
  }
}

