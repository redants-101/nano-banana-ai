/**
 * Creem Create Checkout API
 * 创建 Creem 支付结账会话的 API 路由
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 获取请求数据
    const body = await request.json()
    const { productId, billingCycle } = body

    // 验证必需参数
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // 验证 Creem API Key
    const creemApiKey = process.env.CREEM_API_KEY
    if (!creemApiKey) {
      console.log('[Creem API] CREEM_API_KEY not configured')
      return NextResponse.json(
        { error: 'Payment service not configured. Please configure CREEM_API_KEY in environment variables.' },
        { status: 500 }
      )
    }

    // ✅ Creem API 配置（支持测试和生产环境）
    // 测试环境：https://test-api.creem.io
    // 生产环境：https://api.creem.io
    const CREEM_API_BASE_URL = process.env.CREEM_API_BASE_URL || 'https://api.creem.io'
    const CREEM_API_ENDPOINT = '/v1/checkouts'
    
    console.log('[Creem API] Using environment:', {
      baseUrl: CREEM_API_BASE_URL,
      isTestMode: CREEM_API_BASE_URL.includes('test-api')
    })

    // 准备 Creem API 请求数据（根据官方文档格式）
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // 构建回调 URL（支持语言前缀）
    const locale = request.headers.get('x-locale') || 'en'
    const successUrl = `${siteUrl}/${locale}/payment/success`
    const cancelUrl = `${siteUrl}/${locale}/pricing`
    
    console.log('[Creem API] Site configuration:', {
      siteUrl,
      locale,
      successUrl,
      cancelUrl
    })
    
    const checkoutData = {
      product_id: productId,
      units: 1, // 购买数量，通常为 1
      success_url: successUrl,
      // Creem 可能支持 cancel_url，添加上以防万一
      metadata: {
        plan: billingCycle === 'yearly' ? 'pro_yearly' : 'pro_monthly',
        billingCycle: billingCycle,
        timestamp: new Date().toISOString(),
        locale: locale,
        cancelUrl: cancelUrl // 备用取消 URL
      },
    }

    // 构建完整的 API URL
    const apiUrl = `${CREEM_API_BASE_URL}${CREEM_API_ENDPOINT}`
    
    console.log('[Creem API] Creating checkout session:', {
      productId,
      billingCycle,
      siteUrl,
      apiUrl,
      checkoutData
    })
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': creemApiKey, // Creem 官方认证方式
      },
      body: JSON.stringify(checkoutData),
    })

    console.log('[Creem API] Response status:', response.status)
    console.log('[Creem API] Response headers:', Object.fromEntries(response.headers.entries()))

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Creem API] Error response:', errorText)
      console.error('[Creem API] Request was:', {
        url: apiUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${creemApiKey.substring(0, 10)}...` // 只显示前10个字符
        },
        body: checkoutData
      })
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      // 特殊处理 403 错误
      if (response.status === 403) {
        return NextResponse.json(
          { 
            error: 'Creem API 认证失败（403 Forbidden）', 
            message: '可能的原因：\n' +
              '1. API Key 不正确或已过期\n' +
              '2. API Key 权限不足\n' +
              '3. 产品 ID 不属于此账户\n' +
              '4. 请检查 Creem Dashboard 中的 API Key 设置',
            details: errorData,
            status: response.status,
            troubleshooting: {
              step1: '登录 Creem Dashboard',
              step2: '进入 Settings → API Keys',
              step3: '检查 API Key 是否正确',
              step4: '确认 API Key 有 "Create Checkout" 权限',
              step5: '如需要，重新生成 API Key'
            }
          },
          { status: response.status }
        )
      }

      return NextResponse.json(
        { 
          error: 'Failed to create checkout session', 
          details: errorData,
          status: response.status
        },
        { status: response.status }
      )
    }

    // 获取结账会话数据
    const sessionData = await response.json()
    console.log('[Creem API] Checkout created successfully:', sessionData)

    // Creem API 返回的字段可能是 checkout_url 或 url
    const checkoutUrl = sessionData.checkout_url || sessionData.url || sessionData.payment_url
    
    if (!checkoutUrl) {
      console.error('[Creem API] No checkout URL in response:', sessionData)
      return NextResponse.json(
        { 
          error: 'No checkout URL returned', 
          details: sessionData 
        },
        { status: 500 }
      )
    }

    // 返回支付 URL
    return NextResponse.json({
      checkoutUrl: checkoutUrl,
      sessionId: sessionData.id || sessionData.checkout_id,
      success: true,
      data: sessionData
    })

  } catch (error) {
    console.error('[Creem API] Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
