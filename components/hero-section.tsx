"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export function HeroSection() {
  const t = useTranslations('hero')

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container relative">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {t('badge')}
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            {t('title').split('\n').map((line, index) => (
              <span key={index}>
                {index === 0 ? line : (
                  <>
                    <br />
                    <span className="text-primary">{line}</span>
                  </>
                )}
              </span>
            ))}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t('description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
              <Sparkles className="w-5 h-5 mr-2" />
              {t('tryNow')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button size="lg" variant="outline">
              {t('viewGallery')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}