/**
 * Subscription Status API
 * 获取用户订阅状态的 API
 * 
 * 功能：
 * - 返回用户当前订阅方案
 * - 返回使用额度信息
 * - 返回订阅有效期
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // 获取当前用户
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // 未登录用户返回免费版信息
      return NextResponse.json({
        plan: 'free',
        status: 'inactive',
        credits_used: 0,
        credits_limit: 10,
      })
    }

    // 查询用户订阅信息
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (error || !subscription) {
      // 没有活跃订阅，返回免费版信息
      return NextResponse.json({
        plan: 'free',
        status: 'inactive',
        credits_used: 0,
        credits_limit: 10,
      })
    }

    // 查询本月使用量
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const { count: usageCount } = await supabase
      .from('image_generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${currentMonth}-01`)
      .lt('created_at', `${currentMonth}-32`)

    // 根据订阅方案设置额度限制
    let creditsLimit = 500 // Pro 版默认 500
    if (subscription.plan === 'enterprise') {
      creditsLimit = -1 // -1 表示无限
    }

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      credits_used: usageCount || 0,
      credits_limit: creditsLimit,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      subscription_id: subscription.subscription_id,
    })

  } catch (error) {
    console.error('Get subscription status error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription status', message: (error as Error).message },
      { status: 500 }
    )
  }
}

