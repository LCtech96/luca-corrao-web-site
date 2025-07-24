import { Brain, Code } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Chi è Luca Corrao</h2>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-semibold text-gray-900">Esperto in AI e Sviluppo Software</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Specializzato in Intelligenza Artificiale, Machine Learning e sviluppo di soluzioni software innovative.
                Creo AI Agent personalizzati e sistemi di automazione che trasformano il modo di fare business.
              </p>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-semibold text-gray-900">Innovatore Tecnologico</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Sviluppo soluzioni AI all'avanguardia per aziende che vogliono dominare il mercato attraverso
                l'automazione intelligente e la trasformazione digitale avanzata.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Sviluppo Software</h4>
              <p className="text-sm text-gray-600">Soluzioni personalizzate e innovative</p>
            </div>
            <div className="p-6">
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Intelligenza Artificiale</h4>
              <p className="text-sm text-gray-600">AI Agent e automazione avanzata</p>
            </div>
            <div className="p-6">
              <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Consulenza Strategica</h4>
              <p className="text-sm text-gray-600">Trasformazione digitale e crescita</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
