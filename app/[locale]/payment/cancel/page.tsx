/**
 * Payment Cancel Page
 * 支付取消页面
 * 
 * 路由：/[locale]/payment/cancel
 * 功能：
 * - 展示支付取消信息
 * - 引导用户返回定价页面或主页
 */

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' })
  
  return {
    title: `${t('title')} - Payment Cancelled`,
    description: 'Your payment was cancelled',
  }
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full flex items-center justify-center py-20 px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              支付已取消
            </CardTitle>
            <CardDescription className="text-base mt-2">
              您的支付流程已被取消
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              没有产生任何费用。如果您遇到问题或改变主意，欢迎随时回来。
            </p>
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">需要帮助？</p>
              <p className="text-muted-foreground">
                如果您在支付过程中遇到问题，请联系我们的支持团队。
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Link href="/pricing" className="w-full">
              <Button className="w-full" size="lg">
                返回定价页面
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                返回主页
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

