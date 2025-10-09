/**
 * Creem Webhook Handler
 * 处理 Creem 支付回调的 Webhook API
 * 
 * 功能：
 * - 接收 Creem 支付状态通知
 * - 验证 Webhook 签名
 * - 更新用户订阅状态
 * 
 * 事件类型：
 * - checkout.session.completed: 支付成功
 * - subscription.created: 订阅创建
 * - subscription.updated: 订阅更新
 * - subscription.cancelled: 订阅取消
 * 
 * 参考文档：https://docs.creem.io/api-reference/webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 使用 Service Role Key 以绕过 RLS 策略
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // 获取 Webhook 签名（用于验证请求来自 Creem）
    const signature = request.headers.get('x-creem-signature')
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('CREEM_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    // 获取请求体
    const body = await request.text()
    const event = JSON.parse(body)

    // TODO: 验证 Webhook 签名
    // 这里需要根据 Creem 的具体签名算法来实现
    // 通常是使用 HMAC SHA256
    if (signature) {
      // const isValid = verifySignature(body, signature, webhookSecret)
      // if (!isValid) {
      //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      // }
    }

    // 处理不同的事件类型
    const eventType = event.type || event.event_type

    console.log('Received webhook event:', eventType, event)

    switch (eventType) {
      case 'checkout.session.completed':
        // 支付成功，激活订阅
        await handleCheckoutCompleted(event.data)
        break

      case 'subscription.created':
        // 订阅创建
        await handleSubscriptionCreated(event.data)
        break

      case 'subscription.updated':
        // 订阅更新
        await handleSubscriptionUpdated(event.data)
        break

      case 'subscription.cancelled':
      case 'subscription.deleted':
        // 订阅取消
        await handleSubscriptionCancelled(event.data)
        break

      default:
        console.log('Unhandled event type:', eventType)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', message: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * 处理支付完成事件
 */
async function handleCheckoutCompleted(data: any) {
  try {
    const userId = data.metadata?.user_id
    const plan = data.metadata?.plan || 'pro'
    const subscriptionId = data.subscription_id

    if (!userId || userId === 'anonymous') {
      console.log('No user ID in checkout data')
      return
    }

    // 更新或创建用户订阅记录
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: plan,
        status: 'active',
        subscription_id: subscriptionId,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Failed to update subscription:', error)
    } else {
      console.log('Subscription activated for user:', userId)
    }
  } catch (error) {
    console.error('Error in handleCheckoutCompleted:', error)
  }
}

/**
 * 处理订阅创建事件
 */
async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data)
  // 可以添加额外的逻辑，如发送欢迎邮件等
}

/**
 * 处理订阅更新事件
 */
async function handleSubscriptionUpdated(data: any) {
  try {
    const subscriptionId = data.id
    const status = data.status

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', subscriptionId)

    if (error) {
      console.error('Failed to update subscription:', error)
    }
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error)
  }
}

/**
 * 处理订阅取消事件
 */
async function handleSubscriptionCancelled(data: any) {
  try {
    const subscriptionId = data.id

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('subscription_id', subscriptionId)

    if (error) {
      console.error('Failed to cancel subscription:', error)
    }
  } catch (error) {
    console.error('Error in handleSubscriptionCancelled:', error)
  }
}

