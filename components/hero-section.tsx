"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Decorative banana elements - 确保不超出视口 */}
      <div className="absolute left-4 top-20 text-4xl md:text-6xl opacity-20 rotate-12 hidden sm:block">🍌</div>
      <div className="absolute right-4 bottom-20 text-4xl md:text-6xl opacity-20 -rotate-12 hidden sm:block">🍌</div>

      <div className="container relative mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            🎉 Try the model that understands Flux Kontext. Try Now →
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">Nano Banana</h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character
            editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              Start Editing
            </Button>
            <Button size="lg" variant="outline">
              View Examples
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>One-shot editing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Multi-image support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Natural language</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
