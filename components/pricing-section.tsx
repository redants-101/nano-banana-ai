"use client"

/**
 * Pricing Section Component
 * 定价页面组件 - 展示各种订阅方案和功能对比
 * 
 * 功能特性：
 * - 三种订阅方案：免费版、专业版、企业版
 * - 月付/年付切换
 * - 集成 Creem 支付
 * - 响应式设计
 * - 国际化支持
 */

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Zap, Crown, Building2, Github } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type BillingCycle = 'monthly' | 'yearly'

interface PricingPlan {
  id: string
  icon: React.ComponentType<any>
  priceMonthly: string
  priceYearly?: string
  isPopular?: boolean
  creemProductId?: string // Creem 产品 ID
}

export function PricingSection() {
  const t = useTranslations('pricing')
  const tAuth = useTranslations('auth')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  // 定价方案配置
  const plans: PricingPlan[] = [
    {
      id: 'free',
      icon: Zap,
      priceMonthly: t('plans.free.price'),
      creemProductId: undefined, // 免费版不需要支付
    },
    {
      id: 'pro',
      icon: Crown,
      priceMonthly: t('plans.pro.price'),
      priceYearly: t('plans.pro.yearlyPrice'),
      isPopular: true,
      creemProductId: process.env.NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID,
    },
    {
      id: 'enterprise',
      icon: Building2,
      priceMonthly: t('plans.enterprise.price'),
      creemProductId: undefined, // 企业版需要联系销售
    },
  ]

  // 获取当前价格
  const getPrice = (plan: PricingPlan) => {
    if (plan.priceYearly && billingCycle === 'yearly') {
      return plan.priceYearly
    }
    return plan.priceMonthly
  }

  // 处理登录
  const handleLogin = async (provider: 'github' | 'google') => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          redirectTo: window.location.pathname,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('登录失败，请稍后重试')
    }
    setIsLoginDialogOpen(false)
  }

  // 处理订阅按钮点击
  const handleSubscribe = async (planId: string, productId?: string) => {
    if (planId === 'free') {
      // 免费版打开登录对话框
      setIsLoginDialogOpen(true)
      return
    }

    if (planId === 'enterprise') {
      // 企业版联系销售
      window.location.href = 'mailto:sales@nanobanana.ai'
      return
    }

    if (!productId) {
      console.error('Product ID not configured')
      alert(
        '支付功能尚未配置！\n\n' +
        '如需启用支付功能，请配置以下环境变量：\n' +
        '- CREEM_API_KEY\n' +
        '- NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID\n\n' +
        '详细配置步骤请查看：docs/CREEM_SETUP.md\n\n' +
        '或者暂时跳过支付功能，继续使用免费版。'
      )
      return
    }

    try {
      // 调用创建 Creem 结账会话的 API
      // 使用完整的origin来避免语言前缀导致的路径问题
      const apiUrl = `${window.location.origin}/api/creem/create-checkout`
      console.log('[Payment] Calling API:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          billingCycle,
        }),
      })
      
      console.log('[Payment] API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.checkoutUrl) {
        // 跳转到 Creem 支付页面
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert(
        '支付初始化失败！\n\n' +
        '错误信息：' + (error as Error).message + '\n\n' +
        '可能的原因：\n' +
        '1. Creem API 配置错误\n' +
        '2. 网络连接问题\n' +
        '3. Product ID 不正确\n\n' +
        '请检查浏览器控制台获取更多信息。'
      )
    }
  }

  return (
    <>
      {/* 登录对话框 */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tAuth('selectLoginMethod')}</DialogTitle>
            <DialogDescription>
              {tAuth('loginDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => handleLogin('google')}
              variant="outline"
              className="w-full justify-start"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {tAuth('loginWithGoogle')}
            </Button>
            <Button
              onClick={() => handleLogin('github')}
              variant="outline"
              className="w-full justify-start"
            >
              <Github className="mr-2 h-4 w-4" />
              {tAuth('loginWithGitHub')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 md:px-6">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <Badge className="mb-4 text-sm px-4 py-1">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* 月付/年付切换 */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label htmlFor="billing-toggle" className="text-base font-medium">
            {t('monthly')}
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <Label htmlFor="billing-toggle" className="text-base font-medium">
            {t('yearly')}
          </Label>
          {billingCycle === 'yearly' && (
            <Badge variant="secondary" className="ml-2">
              {t('save', { percent: '20' })}
            </Badge>
          )}
        </div>

        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const features = t.raw(`plans.${plan.id}.features`) as string[]
            
            return (
              <Card 
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.isPopular 
                    ? 'border-2 border-primary shadow-xl scale-105' 
                    : 'border shadow-md'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                      {t('popular')}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-10">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {t(`plans.${plan.id}.name`)}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {t(`plans.${plan.id}.description`)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* 价格显示 */}
                  <div className="text-center mb-8">
                    {plan.id === 'enterprise' ? (
                      <div className="text-3xl font-bold">{getPrice(plan)}</div>
                    ) : (
                      <>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-5xl font-bold">
                            ${getPrice(plan)}
                          </span>
                          <span className="text-muted-foreground">
                            {billingCycle === 'yearly' ? t('perYear') : t('perMonth')}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && plan.priceYearly && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {t('perMonth')}: ${(Number(plan.priceYearly) / 12).toFixed(2)}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* 功能列表 */}
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.isPopular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id, plan.creemProductId)}
                  >
                    {plan.id === 'free' 
                      ? t('selectPlan')
                      : plan.id === 'enterprise'
                      ? '联系销售'
                      : t('selectPlan')
                    }
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* FAQ 部分 */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            {t('faq.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['credits', 'upgrade', 'payment', 'refund', 'cancel'].map((faqId) => (
              <div key={faqId} className="space-y-2">
                <h4 className="font-semibold text-lg">
                  {t(`faq.items.${faqId}.question`)}
                </h4>
                <p className="text-muted-foreground">
                  {t(`faq.items.${faqId}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

