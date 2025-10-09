/**
 * Pricing Page
 * 定价页面 - 展示订阅方案和价格信息
 * 
 * 路由：/[locale]/pricing
 * 功能：
 * - 展示不同的订阅方案
 * - 集成 Creem 支付
 * - 支持国际化
 */

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingSection } from "@/components/pricing-section"
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' })
  
  return {
    title: `${t('title')} - Pricing`,
    description: 'Choose the perfect plan for your AI image editing needs. From free to enterprise solutions.',
  }
}

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}

