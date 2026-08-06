"use client"

import { Brain, Code } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function AboutSection() {
  const t = useTranslation()

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t.about.title}</h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-semibold text-gray-900">{t.about.expertTitle}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t.about.expertDesc}
              </p>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-semibold text-gray-900">{t.about.innovatorTitle}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t.about.innovatorDesc}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">{t.about.softwareTitle}</h4>
              <p className="text-sm text-gray-600">{t.about.softwareDesc}</p>
            </div>
            <div className="p-6">
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">{t.about.aiTitle}</h4>
              <p className="text-sm text-gray-600">{t.about.aiDesc}</p>
            </div>
            <div className="p-6">
              <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">{t.about.consultingTitle}</h4>
              <p className="text-sm text-gray-600">{t.about.consultingDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
