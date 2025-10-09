"use client"

/**
 * Subscription Status Component
 * 订阅状态组件 - 显示用户当前的订阅信息
 * 
 * 功能：
 * - 展示当前订阅方案
 * - 显示剩余额度
 * - 提供升级/降级入口
 */

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Crown, Zap } from "lucide-react"
import Link from "next/link"

interface SubscriptionData {
  plan: string
  status: string
  credits_used: number
  credits_limit: number
  current_period_end: string
}

export function SubscriptionStatus() {
  const t = useTranslations('pricing')
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  // 默认为免费版
  const plan = subscription?.plan || 'free'
  const creditsUsed = subscription?.credits_used || 0
  const creditsLimit = subscription?.credits_limit || 10
  const usagePercent = (creditsUsed / creditsLimit) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {plan === 'pro' || plan === 'pro_yearly' ? (
              <Crown className="w-6 h-6 text-yellow-500" />
            ) : (
              <Zap className="w-6 h-6 text-blue-500" />
            )}
            <div>
              <CardTitle>
                {t(`plans.${plan.includes('pro') ? 'pro' : plan}.name`)}
              </CardTitle>
              <CardDescription>
                {subscription?.status === 'active' ? '活跃' : '免费版'}
              </CardDescription>
            </div>
          </div>
          {subscription?.status === 'active' && (
            <Badge variant="default">已激活</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">本月已使用</span>
            <span className="font-medium">
              {creditsUsed} / {creditsLimit === -1 ? '∞' : creditsLimit}
            </span>
          </div>
          {creditsLimit !== -1 && (
            <Progress value={usagePercent} className="h-2" />
          )}
        </div>

        {subscription?.current_period_end && (
          <div className="text-sm text-muted-foreground">
            续费日期: {new Date(subscription.current_period_end).toLocaleDateString('zh-CN')}
          </div>
        )}
      </CardContent>

      <CardFooter>
        {plan === 'free' ? (
          <Link href="/pricing" className="w-full">
            <Button className="w-full">
              <Crown className="w-4 h-4 mr-2" />
              升级到专业版
            </Button>
          </Link>
        ) : (
          <Link href="/pricing" className="w-full">
            <Button variant="outline" className="w-full">
              管理订阅
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

