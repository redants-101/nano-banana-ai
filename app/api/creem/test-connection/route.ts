/**
 * Creem API Connection Test
 * 测试 Creem API 连接和配置
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const creemApiKey = process.env.CREEM_API_KEY
    
    if (!creemApiKey) {
      return NextResponse.json({
        success: false,
        error: 'CREEM_API_KEY not configured',
        message: '请在 .env.local 中配置 CREEM_API_KEY'
      }, { status: 500 })
    }

    // 测试多个可能的 API endpoints
    const endpoints = [
      'https://api.creem.io/v1/checkout-sessions',
      'https://api.creem.io/v1/checkout/sessions',
      'https://api.creem.io/checkout-sessions',
      'https://api.creem.io/v1/sessions',
    ]

    const authMethods = [
      { name: 'Bearer Token', header: `Bearer ${creemApiKey}` },
      { name: 'X-API-Key', header: creemApiKey },
    ]

    const results = []

    for (const endpoint of endpoints) {
      for (const auth of authMethods) {
        try {
          console.log(`[Test] Trying: ${endpoint} with ${auth.name}`)
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(auth.name === 'Bearer Token' 
                ? { 'Authorization': auth.header }
                : { 'x-api-key': auth.header }
              ),
            },
            body: JSON.stringify({
              product_id: 'test_product',
              billing_cycle: 'monthly',
              success_url: 'http://localhost:3000/success',
              cancel_url: 'http://localhost:3000/cancel',
            }),
          })

          const text = await response.text()
          let data
          try {
            data = JSON.parse(text)
          } catch {
            data = text
          }

          results.push({
            endpoint,
            authMethod: auth.name,
            status: response.status,
            statusText: response.statusText,
            success: response.ok,
            response: data,
            note: response.status === 404 
              ? '❌ Endpoint 不存在' 
              : response.status === 401 
              ? '❌ 认证失败' 
              : response.status === 400 
              ? '⚠️ 参数错误（但 endpoint 存在！）'
              : response.ok 
              ? '✅ 成功！'
              : '⚠️ 其他错误'
          })

          console.log(`[Test] Result: ${response.status} ${response.statusText}`)

          // 如果找到工作的配置，立即返回
          if (response.ok || response.status === 400) {
            return NextResponse.json({
              success: true,
              message: response.status === 400 
                ? '✅ 找到正确的 endpoint！（参数错误是正常的，因为我们用的是测试数据）'
                : '✅ 完全成功！',
              workingConfig: {
                endpoint,
                authMethod: auth.name,
                status: response.status
              },
              allResults: results,
              recommendation: `请在 route.ts 中使用：
                
endpoint: '${endpoint}'
headers: ${auth.name === 'Bearer Token' 
  ? `{ 'Authorization': 'Bearer \${creemApiKey}' }`
  : `{ 'x-api-key': creemApiKey }`
}
              `
            })
          }

        } catch (error) {
          results.push({
            endpoint,
            authMethod: auth.name,
            error: (error as Error).message,
            note: '❌ 网络错误或 endpoint 无效'
          })
        }
      }
    }

    // 如果所有配置都失败
    return NextResponse.json({
      success: false,
      message: '❌ 所有 endpoint 和认证方式组合都失败了',
      allResults: results,
      recommendations: [
        '1. 检查 CREEM_API_KEY 是否正确',
        '2. 访问 Creem Dashboard 确认正确的 API endpoint',
        '3. 查看 Creem API 文档：https://docs.creem.io',
        '4. 确认你的 Creem 账户已激活',
        '5. 检查 API Key 权限设置'
      ]
    })

  } catch (error) {
    console.error('[Test] Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: (error as Error).message
    }, { status: 500 })
  }
}

