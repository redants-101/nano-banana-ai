/**
 * Payment Success Page
 * 支付成功页面
 * 
 * 路由：/[locale]/payment/success
 * 功能：
 * - 展示支付成功信息
 * - 引导用户返回主页或开始使用
 */

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' })
  
  return {
    title: `${t('title')} - Payment Success`,
    description: 'Your payment was successful!',
  }
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full flex items-center justify-center py-20 px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              支付成功！
            </CardTitle>
            <CardDescription className="text-base mt-2">
              感谢您订阅 Nano Banana Pro！
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              您的订阅已激活，现在可以享受所有高级功能：
            </p>
            <ul className="text-left space-y-2 text-sm">
              <li>✓ 每月 500 次生成</li>
              <li>✓ 高清图像质量 (4K)</li>
              <li>✓ 批量处理功能</li>
              <li>✓ 角色一致性</li>
              <li>✓ 优先处理队列</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              确认邮件已发送到您的邮箱
            </p>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="w-full" size="lg">
                开始使用
              </Button>
            </Link>
            <Link href="/pricing" className="w-full">
              <Button variant="outline" className="w-full">
                查看订阅详情
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

