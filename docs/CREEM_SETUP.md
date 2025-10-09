# Creem 支付集成指南

本文档介绍如何配置和集成 Creem 支付系统。

## 📋 概述

Creem 是一个专为 SaaS 产品设计的支付平台，提供简单的 API 和自动化的订阅管理。

**官方文档**:
- [Creem 介绍](https://docs.creem.io/introduction)
- [API 参考](https://docs.creem.io/api-reference/introduction)

## 🚀 快速开始

### 1. 创建 Creem 账户

1. 访问 [Creem 官网](https://creem.io)
2. 注册账户
3. 完成邮箱验证

### 2. 获取 API 密钥

1. 登录 Creem Dashboard
2. 进入 **Settings** → **API Keys**
3. 创建新的 API Key
4. 复制以下信息：
   - **API Key** (用于服务端 API 调用)
   - **Webhook Secret** (用于验证 Webhook 签名)

⚠️ **安全提示**: 请妥善保管 API Key，不要提交到 Git 仓库！

### 3. 创建产品 (Products)

在 Creem Dashboard 中创建你的订阅产品：

#### 专业版 - 月付

- **名称**: Nano Banana Pro (Monthly)
- **价格**: $19/月
- **计费周期**: Monthly
- **描述**: 每月 500 次生成，高清质量，所有高级功能

#### 专业版 - 年付

- **名称**: Nano Banana Pro (Yearly)
- **价格**: $190/年
- **计费周期**: Yearly
- **描述**: 节省 20%，每月 500 次生成，高清质量

创建完成后，复制每个产品的 **Product ID**。

### 4. 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```env
# Creem API Configuration
CREEM_API_KEY=your-creem-api-key-here
CREEM_WEBHOOK_SECRET=your-webhook-secret-here

# Creem Product IDs
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyy

# Supabase Service Role Key (用于 Webhook)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site URL (用于支付回调)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

**获取 Supabase Service Role Key**:
1. 登录 Supabase Dashboard
2. 进入项目的 **Settings** → **API**
3. 复制 **service_role** key（注意不是 anon key）

### 5. 配置 Webhook

Webhook 用于接收 Creem 的支付通知。

#### 5.1 部署应用

首先确保你的应用已部署到生产环境（如 Vercel、Netlify 等），并获得公网可访问的 URL。

#### 5.2 在 Creem 中配置 Webhook

1. 登录 Creem Dashboard
2. 进入 **Settings** → **Webhooks**
3. 点击 **Add Endpoint**
4. 填写以下信息：
   - **URL**: `https://your-domain.com/api/creem/webhook`
   - **Events**: 选择以下事件
     - `checkout.session.completed`
     - `subscription.created`
     - `subscription.updated`
     - `subscription.cancelled`
5. 保存配置

#### 5.3 测试 Webhook

Creem Dashboard 提供了测试功能：

1. 在 Webhooks 页面选择你的 endpoint
2. 点击 **Send Test Event**
3. 选择事件类型并发送
4. 检查你的应用日志，确认收到了 Webhook 请求

## 🔧 API 集成说明

### 创建结账会话

当用户点击订阅按钮时，前端调用：

```typescript
const response = await fetch('/api/creem/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'prod_xxxxx',
    billingCycle: 'monthly' // or 'yearly'
  })
})

const { checkoutUrl } = await response.json()
window.location.href = checkoutUrl // 跳转到 Creem 支付页面
```

### 处理支付回调

支付完成后，Creem 会：
1. 将用户重定向到 `success_url`（成功）或 `cancel_url`（取消）
2. 向你的 Webhook 端点发送事件通知

Webhook 处理流程：
```
Creem 发送通知 
  → /api/creem/webhook 
  → 验证签名 
  → 更新数据库 
  → 返回 200 OK
```

## 📊 订阅状态管理

### 订阅状态说明

- **active**: 订阅活跃中
- **cancelled**: 已取消（但在当前周期结束前仍可使用）
- **expired**: 已过期

### 查询订阅状态

前端组件可以调用：

```typescript
const response = await fetch('/api/subscription/status')
const subscription = await response.json()

console.log(subscription)
// {
//   plan: 'pro',
//   status: 'active',
//   credits_used: 50,
//   credits_limit: 500,
//   current_period_end: '2024-11-01T00:00:00Z'
// }
```

## 🧪 测试支付流程

### 开发环境测试

1. 确保配置了 Creem 测试环境的 API Key
2. 使用 Creem 提供的测试卡号
3. 完成支付流程
4. 检查数据库中的订阅记录

### 生产环境检查清单

- [ ] 已配置生产环境的 API Key
- [ ] Webhook URL 可公网访问
- [ ] 已在 Creem Dashboard 配置 Webhook
- [ ] 已测试支付成功流程
- [ ] 已测试支付取消流程
- [ ] 已测试 Webhook 接收
- [ ] 数据库表已创建（参考 DATABASE_SETUP.md）
- [ ] RLS 策略已正确配置

## 🔒 安全最佳实践

1. **保护 API Key**
   - 不要在客户端代码中暴露 API Key
   - 使用环境变量存储密钥
   - 定期轮换 API Key

2. **验证 Webhook**
   - 始终验证 Webhook 签名
   - 检查事件的幂等性（避免重复处理）
   - 记录所有 Webhook 事件

3. **用户数据保护**
   - 使用 RLS 策略保护订阅数据
   - 只允许用户查看自己的订阅
   - 使用 Service Role Key 进行管理操作

4. **错误处理**
   - 妥善处理 API 调用失败
   - 提供友好的错误提示
   - 记录错误日志用于调试

## 📈 监控和日志

### 推荐监控指标

- 支付成功率
- Webhook 接收成功率
- 订阅激活延迟
- API 错误率

### 日志记录

建议记录以下事件：
- 所有 Creem API 调用
- Webhook 接收和处理
- 订阅状态变更
- 支付失败原因

## 🐛 常见问题

### Q: Webhook 没有收到通知？

**检查清单**:
1. URL 是否可公网访问？（使用 curl 测试）
2. Webhook 配置是否正确？
3. 是否选择了正确的事件类型？
4. 检查应用日志是否有错误

### Q: 支付成功但订阅未激活？

**排查步骤**:
1. 检查 Webhook 日志
2. 验证数据库连接
3. 确认 Service Role Key 配置正确
4. 查看 Supabase 日志

### Q: 如何测试 Webhook？

使用 [webhook.site](https://webhook.site) 或 ngrok：

```bash
# 使用 ngrok 创建临时公网 URL
ngrok http 3000

# 在 Creem 中配置 Webhook URL
# https://xxxx.ngrok.io/api/creem/webhook
```

### Q: 支持哪些支付方式？

Creem 支持：
- 信用卡/借记卡
- 其他主流支付方式（取决于 Creem 配置）

查看 [Creem 文档](https://docs.creem.io) 了解最新支持的支付方式。

### Q: 如何处理退款？

在 Creem Dashboard 中：
1. 进入 **Payments** → **Transactions**
2. 找到对应的支付记录
3. 点击 **Refund** 按钮
4. 系统会自动更新订阅状态

## 🔗 相关资源

- [Creem 官方文档](https://docs.creem.io)
- [数据库设置指南](./DATABASE_SETUP.md)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 📞 获取帮助

- Creem 支持: support@creem.io
- Creem 社区: [Discord](https://discord.gg/creem)
- 项目问题: [GitHub Issues](https://github.com/yourusername/nano-banana-ai/issues)

