import { NextResponse } from 'next/server';

/**
 * 健康检查和环境配置诊断端点
 * 访问：GET /api/health-check
 * 
 * 用途：
 * 1. 检查服务是否正常运行
 * 2. 验证环境变量配置
 * 3. 诊断生产环境问题
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  
  // 检查关键环境变量
  const apiKey = process.env.OPENROUTER_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  
  // 环境配置状态
  const config = {
    apiKey: {
      configured: !!apiKey,
      length: apiKey ? apiKey.length : 0,
      // 安全：只显示前几个字符
      preview: apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT_SET',
    },
    siteUrl: {
      configured: !!siteUrl,
      value: siteUrl || 'NOT_SET',
      isLocalhost: siteUrl?.includes('localhost') || false,
    },
    siteName: {
      configured: !!siteName,
      value: siteName || 'NOT_SET',
    },
  };
  
  // 诊断结果
  const diagnostics = {
    status: 'ok',
    warnings: [] as string[],
    errors: [] as string[],
  };
  
  // 检查问题
  if (!apiKey) {
    diagnostics.status = 'error';
    diagnostics.errors.push('OPENROUTER_API_KEY is not configured');
  }
  
  if (!siteUrl) {
    diagnostics.warnings.push('NEXT_PUBLIC_SITE_URL is not configured, using default');
  } else if (siteUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    diagnostics.status = 'warning';
    diagnostics.warnings.push('NEXT_PUBLIC_SITE_URL is set to localhost in production environment');
  }
  
  // 返回诊断结果
  return NextResponse.json({
    timestamp,
    service: 'Nano Banana AI Image Editor',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    diagnostics,
    config,
    recommendations: diagnostics.errors.length > 0 || diagnostics.warnings.length > 0 
      ? [
          '1. 确保在生产环境配置了 OPENROUTER_API_KEY',
          '2. 确保 NEXT_PUBLIC_SITE_URL 设置为生产域名（不是 localhost）',
          '3. 修改环境变量后需要重新构建和部署',
          '4. 查看详细指南：docs/PRODUCTION_DEPLOYMENT.md',
        ]
      : ['✅ All configurations look good!'],
  });
}
