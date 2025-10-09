# 支付模块诊断报告

## 📋 问题描述

用户在调用 `/api/creem/create-checkout` 接口时遇到 404 错误。

## 🔍 问题排查过程

### 1. 检查项目结构

✅ **API 路由文件存在**
- 路径：`app/api/creem/create-checkout/route.ts`
- 导出：`export async function POST(request: NextRequest)`
- 状态：✅ 正常

### 2. 检查 Middleware 配置

✅ **Middleware 配置正确**
```typescript
// middleware.ts
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
```
- API 路由已被正确排除（`!api`）
- 不会被国际化 middleware 拦截
- 状态：✅ 正常

### 3. 检查前端调用代码

❌ **发现问题：相对路径问题**

**原代码（错误）：**
```typescript
// components/pricing-section.tsx
const response = await fetch('/api/creem/create-checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId,
    billingCycle,
  }),
})
```

**问题分析：**
当用户访问 `/zh/pricing` 或 `/en/pricing` 页面时，浏览器会将相对路径 `/api/creem/create-checkout` 解析为：
- ❌ `/zh/api/creem/create-checkout` （错误）
- ✅ 正确路径应该是：`/api/creem/create-checkout`

这导致了 404 错误！

### 4. 解决方案

**修复后的代码：**
```typescript
// components/pricing-section.tsx
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
```

**改进点：**
1. ✅ 使用 `window.location.origin` 获取完整域名
2. ✅ 添加日志输出，便于调试
3. ✅ 避免相对路径导致的路由问题

## 📊 完整排查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| API 路由文件是否存在 | ✅ | `app/api/creem/create-checkout/route.ts` |
| 路由导出是否正确 | ✅ | `export async function POST()` |
| Middleware 配置是否排除 API | ✅ | 使用 `!api` 排除 |
| 前端调用路径是否正确 | ❌ → ✅ | 已修复为使用 `window.location.origin` |
| 环境变量配置 | ⚠️ | 需要用户配置 `CREEM_API_KEY` |

## 🎯 根本原因

**Next.js 14 国际化路由与相对路径冲突**

在使用 Next.js 14 的 App Router 和 next-intl 进行国际化时：
- 所有页面 URL 都带有语言前缀（`/zh/...`, `/en/...`）
- 相对路径会基于当前 URL 进行解析
- 导致 API 调用路径被错误解析

## ✅ 解决方案总结

### 方案 1：使用 window.location.origin（推荐）✨
```typescript
const apiUrl = `${window.location.origin}/api/creem/create-checkout`
const response = await fetch(apiUrl, { ... })
```

### 方案 2：使用绝对路径（备选）
```typescript
const response = await fetch('http://localhost:3000/api/creem/create-checkout', { ... })
```
⚠️ 注意：需要根据环境切换域名

### 方案 3：创建 API 客户端封装（最佳实践）
```typescript
// lib/api-client.ts
export function getApiUrl(path: string): string {
  if (typeof window === 'undefined') {
    // 服务端
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${path}`
  }
  // 客户端
  return `${window.location.origin}${path}`
}

// 使用
const response = await fetch(getApiUrl('/api/creem/create-checkout'), { ... })
```

## 🧪 测试方法

### 1. 使用测试工具
打开项目根目录的 `test-payment-api.html` 文件进行测试：
```bash
# 在浏览器中打开
http://localhost:3000/test-payment-api.html
```

### 2. 浏览器控制台测试
```javascript
// 在 /zh/pricing 页面打开控制台
fetch(`${window.location.origin}/api/creem/create-checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'test_product_id',
    billingCycle: 'monthly'
  })
}).then(res => res.json()).then(console.log)
```

### 3. 使用 curl 测试
```bash
curl -X POST http://localhost:3000/api/creem/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"productId":"test_product_id","billingCycle":"monthly"}'
```

## 📝 环境变量配置

确保 `.env.local` 中配置了以下变量：

```env
# Creem 支付配置（必需）
CREEM_API_KEY=your-creem-api-key-here
CREEM_WEBHOOK_SECRET=your-webhook-secret-here

# 产品 ID（必需）
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyy

# 网站 URL（必需）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 验证步骤

1. ✅ 修复前端代码（已完成）
2. ⏳ 重启开发服务器
3. ⏳ 访问定价页面（`http://localhost:3000/zh/pricing`）
4. ⏳ 点击"选择方案"按钮
5. ⏳ 检查浏览器控制台的日志输出
6. ⏳ 验证 API 调用成功

## 📚 相关文档

- [Creem 设置指南](./CREEM_SETUP.md)
- [数据库设置指南](./DATABASE_SETUP.md)
- [环境变量配置](./ENV_CONFIG.md)
- [定价功能实现](./PRICING_IMPLEMENTATION.md)

## 💡 预防类似问题的建议

1. **统一 API 调用方式**
   - 创建 API 客户端工具函数
   - 所有 API 调用都使用统一的工具函数

2. **添加日志输出**
   - 在关键位置添加 console.log
   - 便于调试和排查问题

3. **编写 API 测试**
   - 创建独立的测试页面
   - 在不同路由下测试 API 调用

4. **代码审查检查点**
   - 检查所有 fetch 调用
   - 确保使用正确的路径格式

## ❓ 常见问题

### Q: 为什么不能直接使用 `/api/...` ？
A: 因为在国际化路由中，相对路径会基于当前 URL 解析。在 `/zh/pricing` 页面中，`/api/...` 会被解析为 `/zh/api/...`。

### Q: 服务端 API 调用也需要这样处理吗？
A: 不需要。这个问题只存在于客户端（浏览器）中的 fetch 调用。服务端 API 路由之间的调用不受影响。

### Q: 所有 API 调用都需要修改吗？
A: 是的，建议检查所有客户端的 API 调用，统一使用 `window.location.origin` 或创建 API 客户端工具。

---

**最后更新时间：** 2025-10-09
**维护者：** Claude AI Assistant

