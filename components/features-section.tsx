"use client"

import { Sparkles, Layers, ImageIcon, Zap, Grid3x3, Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

const featureIcons = [
  Sparkles,
  Layers,
  ImageIcon,
  Zap,
  Grid3x3,
  Palette
]

const featureKeys = [
  'naturalLanguage',
  'characterConsistency',
  'scenePreservation',
  'oneShotEditing',
  'multiImageContext',
  'aiUgcCreation'
] as const

export function FeaturesSection() {
  const t = useTranslations('features')
  
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[index]
            return (
              <Card key={key} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{t(`items.${key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {t(`items.${key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}