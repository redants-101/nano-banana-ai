"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

// FAQ 问题的键名列表
const faqKeys = ['different', 'upload', 'commercial', 'consistency', 'speed', 'api'] as const

export function FAQSection() {
  const t = useTranslations('faq')
  
  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">{t('description')}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqKeys.map((key, index) => (
            <AccordionItem
              key={key}
              value={`item-${index}`}
              className="border-2 rounded-lg px-6 bg-card last:border-b-2"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{t(`items.${key}.question`)}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(`items.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
