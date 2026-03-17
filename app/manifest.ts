import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "B&B e Appartamenti in Sicilia",
    short_name: "B&B Sicilia",
    description: "B&B, affittacamere e appartamenti a Terrasini e Palermo (Sicilia, Italy).",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#fbbf24",
    lang: "it",
  }
}

