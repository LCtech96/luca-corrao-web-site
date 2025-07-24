import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"
import { AIChat } from "@/components/ai-chat"
import { FeaturesSection } from "@/components/features-section"
import { AccommodationsSection } from "@/components/accommodations-section"
import { ContactSection } from "@/components/contact-section"
import { VoiceAISection } from "@/components/voice-ai-section"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <AboutSection />
      <AIChat />
      <FeaturesSection />
      <VoiceAISection />
      <AccommodationsSection />
      <ContactSection />
    </main>
  )
}
