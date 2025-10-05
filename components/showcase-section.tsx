"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

const showcaseImages = [
  "/majestic-mountain-range-at-golden-hour-with-dramat.jpg",
  "/beautiful-japanese-garden-with-cherry-blossoms-and.jpg",
  "/tropical-beach-with-palm-trees-and-crystal-clear-t.jpg",
  "/northern-lights-aurora-borealis-over-snowy-landsca.jpg"
]

const showcaseKeys = [
  'mountain',
  'garden',
  'tropical',
  'aurora'
] as const

export function ShowcaseSection() {
  const t = useTranslations('showcase')

  return (
    <section id="showcase" className="py-20 bg-secondary/30">
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

        <div className="grid md:grid-cols-2 gap-6">
          {showcaseKeys.map((key, index) => (
            <Card
              key={key}
              className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={showcaseImages[index] || "/placeholder.svg"}
                  alt={t(`items.${key}.title`)}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {t(`items.${key}.badge`)}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{t(`items.${key}.title`)}</h3>
                <p className="text-muted-foreground">{t(`items.${key}.description`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}