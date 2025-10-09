# 🔧 Creem API 配置指南

## 📋 问题诊断

你的 Next.js API 路由工作正常，但 Creem API 返回 404 错误。这意味着需要配置正确的 Creem API endpoint。

## 🎯 快速配置步骤

### 步骤 1：登录 Creem Dashboard

访问 Creem 并登录：
- https://creem.io
- 或 https://app.creem.io

### 步骤 2：查找 API 信息

在 Creem Dashboard 中查找以下内容：

#### A. 在左侧菜单或顶部导航中找到：
- **"Developers"** / **"开发者"**
- **"API"** / **"API Keys"**
- **"Settings"** → **"API"**
- **"Documentation"** / **"文档"**

#### B. 需要获取的关键信息：

**1. API Base URL**（基础地址）
```
可能的值：
✓ https://api.creem.io
✓ https://checkout.creem.io
✓ https://app.creem.io/api
✓ https://creem.io/api
```

**2. Create Checkout Endpoint**（创建支付会话的路径）
```
可能的值：
✓ /v1/checkout/sessions
✓ /v1/checkout-sessions
✓ /v1/sessions
✓ /checkout
✓ /api/checkout
```

**3. 认证方式**（Authentication Method）
```
可能的值：
✓ Authorization: Bearer YOUR_API_KEY
✓ X-API-Key: YOUR_API_KEY
✓ Api-Key: YOUR_API_KEY
```

**4. 请求参数格式**
```json
// 可能的参数名称：
{
  "product_id": "prod_xxx",     // 或 "productId"
  "billing_cycle": "monthly",   // 或 "billingCycle" 或 "interval"
  "success_url": "...",         // 或 "successUrl" 或 "return_url"
  "cancel_url": "...",          // 或 "cancelUrl"
}
```

### 步骤 3：配置环境变量

在项目的 `.env.local` 文件中添加以下变量：

```env
# Creem API 配置
CREEM_API_KEY=your-actual-api-key-here
CREEM_WEBHOOK_SECRET=your-webhook-secret-here

# Creem API Endpoint 配置（根据 Dashboard 中的信息填写）
CREEM_API_BASE_URL=https://api.creem.io
CREEM_API_ENDPOINT=/v1/checkout-sessions
CREEM_AUTH_TYPE=Bearer

# 产品 ID
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyy

# 网站 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 步骤 4：重启开发服务器

修改环境变量后必须重启：

```bash
# 停止服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 步骤 5：测试

访问定价页面并测试支付功能：
```
http://localhost:3000/zh/pricing
```

---

## 📖 常见的 Creem API 配置

### 配置 1：标准配置
```env
CREEM_API_BASE_URL=https://api.creem.io
CREEM_API_ENDPOINT=/v1/checkout/sessions
CREEM_AUTH_TYPE=Bearer
```

### 配置 2：简化路径
```env
CREEM_API_BASE_URL=https://api.creem.io
CREEM_API_ENDPOINT=/checkout-sessions
CREEM_AUTH_TYPE=X-API-Key
```

### 配置 3：自定义域名
```env
CREEM_API_BASE_URL=https://checkout.creem.io
CREEM_API_ENDPOINT=/v1/sessions
CREEM_AUTH_TYPE=Bearer
```

---

## 🔍 如何在 Creem Dashboard 中查找信息

### 方法 1：查看 API 文档
1. 登录 Creem Dashboard
2. 查找 "API Documentation" 或 "Developers" 部分
3. 找到 "Create Checkout Session" 的示例
4. 复制示例中的 URL 和 headers

### 方法 2：查看示例代码
Creem 通常会提供示例代码（Node.js、Python 等）：
```javascript
// 示例代码可能是这样的：
const response = await fetch('https://api.creem.io/v1/checkout/sessions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...})
})
```

从这个示例中你可以得到：
- Base URL: `https://api.creem.io`
- Endpoint: `/v1/checkout/sessions`
- Auth Type: `Bearer`

### 方法 3：联系 Creem 支持
如果找不到文档：
1. 在 Dashboard 中查找 "Support" 或 "Help"
2. 发送消息询问正确的 API endpoint
3. 或查看 Creem 的官方文档网站

---

## 🧪 测试配置是否正确

### 使用测试工具

访问测试页面（我已经创建好了）：
```
http://localhost:3000/test-payment-debug.html
```

点击 "运行完整诊断"，查看结果。

### 使用 API 测试工具

访问连接测试 API：
```
http://localhost:3000/api/creem/test-connection
```

如果配置正确，你会看到 ✅ 成功的消息。

### 手动测试（curl）

```bash
curl -X POST https://api.creem.io/v1/checkout/sessions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_xxxxx",
    "billing_cycle": "monthly",
    "success_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel"
  }'
```

如果返回 404，说明 URL 不对。
如果返回 401，说明认证方式不对。
如果返回 400，说明 URL 正确但参数不对！（这是好消息！）

---

## ⚡ 快速诊断清单

检查以下内容：

- [ ] 我已登录 Creem Dashboard
- [ ] 我找到了 API 文档或开发者部分
- [ ] 我知道正确的 API Base URL
- [ ] 我知道正确的 endpoint 路径
- [ ] 我知道正确的认证方式
- [ ] 我已更新 `.env.local` 文件
- [ ] 我已重启开发服务器
- [ ] 我已测试 API 调用

---

## 💬 提供信息给 AI 助手

请将以下信息提供给我，我会立即帮你配置：

```
1. API Base URL: _______________
2. Endpoint Path: _______________
3. Auth Type: _______________
4. 请求参数格式（如果与标准不同）: _______________
```

或者，如果你看到了 Creem 的示例代码，直接复制粘贴给我！

---

## 📚 相关资源

- [Creem 官网](https://creem.io)
- [Creem 文档](https://docs.creem.io)
- [项目 Creem 设置指南](./CREEM_SETUP.md)
- [环境变量配置](./ENV_CONFIG.md)

---

**最后更新时间：** 2025-10-09
**维护者：** Claude AI Assistant

