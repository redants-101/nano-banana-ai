/**
 * Environment Variables Check API
 * 环境变量检查 API - 用于诊断配置问题
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      timestamp: new Date().toISOString(),
      
      // 基础配置
      basic: {
        NEXT_PUBLIC_SITE_URL: {
          value: process.env.NEXT_PUBLIC_SITE_URL ? '✅ 已配置' : '❌ 未配置',
          actual: process.env.NEXT_PUBLIC_SITE_URL || 'undefined'
        },
        NEXT_PUBLIC_SITE_NAME: {
          value: process.env.NEXT_PUBLIC_SITE_NAME ? '✅ 已配置' : '⚠️ 未配置（可选）',
          actual: process.env.NEXT_PUBLIC_SITE_NAME || 'undefined'
        },
      },

      // Supabase 配置
      supabase: {
        NEXT_PUBLIC_SUPABASE_URL: {
          value: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置',
          actual: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
            process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' : 
            'undefined'
        },
        NEXT_PUBLIC_SUPABASE_ANON_KEY: {
          value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置',
          actual: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30) + '...' : 
            'undefined'
        },
        SUPABASE_SERVICE_ROLE_KEY: {
          value: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已配置' : '❌ 未配置',
          actual: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
            '***已配置（隐藏）***' : 
            'undefined'
        },
      },

      // Creem 支付配置
      creem: {
        CREEM_API_KEY: {
          value: process.env.CREEM_API_KEY ? '✅ 已配置' : '⚠️ 未配置（支付功能需要）',
          actual: process.env.CREEM_API_KEY ? 
            '***已配置（隐藏）***' : 
            'undefined'
        },
        CREEM_WEBHOOK_SECRET: {
          value: process.env.CREEM_WEBHOOK_SECRET ? '✅ 已配置' : '⚠️ 未配置（Webhook 需要）',
          actual: process.env.CREEM_WEBHOOK_SECRET ? 
            '***已配置（隐藏）***' : 
            'undefined'
        },
        NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID: {
          value: process.env.NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID ? '✅ 已配置' : '⚠️ 未配置（Pro 订阅需要）',
          actual: process.env.NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID || 'undefined'
        },
        NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID: {
          value: process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID ? '✅ 已配置' : '⚠️ 未配置（年付订阅需要）',
          actual: process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID || 'undefined'
        },
      },

      // OpenRouter AI 配置
      ai: {
        OPENROUTER_API_KEY: {
          value: process.env.OPENROUTER_API_KEY ? '✅ 已配置' : '❌ 未配置（AI 功能需要）',
          actual: process.env.OPENROUTER_API_KEY ? 
            process.env.OPENROUTER_API_KEY.substring(0, 15) + '...' : 
            'undefined'
        },
      },
    }

    // 统计配置状态
    const allConfigs = [
      ...Object.values(envCheck.basic),
      ...Object.values(envCheck.supabase),
      ...Object.values(envCheck.creem),
      ...Object.values(envCheck.ai),
    ]

    const configuredCount = allConfigs.filter(c => c.value.includes('✅')).length
    const totalCount = allConfigs.length
    const optionalCount = allConfigs.filter(c => c.value.includes('⚠️')).length
    const requiredCount = totalCount - optionalCount

    const summary = {
      total: totalCount,
      configured: configuredCount,
      required: requiredCount,
      optional: optionalCount,
      status: configuredCount >= (requiredCount - optionalCount) ? '✅ 基本配置完成' : '⚠️ 需要配置更多环境变量',
    }

    return NextResponse.json({
      success: true,
      summary,
      details: envCheck,
      recommendations: getRecommendations(envCheck)
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to check environment variables', 
        message: (error as Error).message 
      },
      { status: 500 }
    )
  }
}

function getRecommendations(envCheck: any): string[] {
  const recommendations: string[] = []

  // 检查 Supabase
  const supabaseConfigured = 
    envCheck.supabase.NEXT_PUBLIC_SUPABASE_URL.value.includes('✅') &&
    envCheck.supabase.NEXT_PUBLIC_SUPABASE_ANON_KEY.value.includes('✅')

  if (!supabaseConfigured) {
    recommendations.push('🔐 配置 Supabase 以启用用户认证功能（查看 docs/SUPABASE_SETUP.md）')
  }

  // 检查 Creem
  const creemConfigured = 
    envCheck.creem.CREEM_API_KEY.value.includes('✅') &&
    envCheck.creem.NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID.value.includes('✅')

  if (!creemConfigured) {
    recommendations.push('💳 配置 Creem 以启用支付功能（查看 docs/CREEM_SETUP.md）')
  }

  // 检查 OpenRouter
  const aiConfigured = envCheck.ai.OPENROUTER_API_KEY.value.includes('✅')

  if (!aiConfigured) {
    recommendations.push('🤖 配置 OpenRouter API Key 以启用 AI 图像处理功能')
  }

  // 检查站点 URL
  const siteUrlConfigured = envCheck.basic.NEXT_PUBLIC_SITE_URL.value.includes('✅')

  if (!siteUrlConfigured) {
    recommendations.push('🌐 配置 NEXT_PUBLIC_SITE_URL 环境变量（如：http://localhost:3000）')
  }

  if (recommendations.length === 0) {
    recommendations.push('🎉 所有关键环境变量都已正确配置！')
  }

  return recommendations
}

