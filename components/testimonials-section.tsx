"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"

// 头像配置（不需要翻译）
const avatarMap = {
  sarah: "/professional-woman-portrait.png",
  marcus: "/professional-man-portrait.png",
  emily: "/confident-businesswoman.png"
}

const testimonialKeys = ['sarah', 'marcus', 'emily'] as const

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  
  return (
    <section className="py-20">
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

        <div className="grid md:grid-cols-3 gap-6">
          {testimonialKeys.map((key) => (
            <Card key={key} className="border-2">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{t(`items.${key}.content`)}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarMap[key] || "/placeholder.svg"}
                    alt={t(`items.${key}.name`)}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{t(`items.${key}.name`)}</p>
                    <p className="text-sm text-muted-foreground">{t(`items.${key}.role`)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
