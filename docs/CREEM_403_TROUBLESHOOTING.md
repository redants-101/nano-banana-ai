# 🔐 Creem 403 错误排查指南

## 📊 当前状态

✅ **好消息**: API endpoint 已经正确（从 404 → 403）！  
⚠️ **问题**: 403 Forbidden - 认证或权限问题

## 🔍 403 错误详解

HTTP 403 Forbidden 表示：
- ✅ 服务器收到了请求
- ✅ API endpoint 正确
- ❌ **但服务器拒绝授权这个请求**

---

## 🛠️ 解决步骤

### 步骤 1：检查 API Key（最常见原因）

#### 1.1 登录 Creem Dashboard
```
https://creem.io
或
https://app.creem.io
```

#### 1.2 进入 API Keys 设置
- 导航到：**Settings** → **API Keys**
- 或者：**Developers** → **API Keys**

#### 1.3 检查以下内容：

**A. API Key 是否正确？**
```bash
# 在你的 .env.local 中
CREEM_API_KEY=你的API密钥

# 对比 Creem Dashboard 中显示的 API Key
# 是否完全一致？（注意没有多余空格）
```

**B. API Key 是否过期？**
- 查看 API Key 的创建日期
- 查看是否有过期时间

**C. API Key 权限是否足够？**
- 确认 API Key 类型是 **"Secret Key"** 或 **"Server Key"**
- 不是 **"Public Key"** 或 **"Publishable Key"**

**D. API Key 是否被撤销？**
- 检查状态是否为 "Active"

#### 1.4 重新生成 API Key（推荐）

1. 在 Creem Dashboard 中**创建新的 API Key**
2. 复制新的 API Key
3. 更新 `.env.local` 文件：
   ```env
   CREEM_API_KEY=新的API密钥
   ```
4. **重启开发服务器**：
   ```bash
   # Ctrl+C 停止服务器
   npm run dev
   ```

---

### 步骤 2：检查产品 ID

#### 2.1 验证产品是否存在

1. 登录 Creem Dashboard
2. 进入 **Products** 页面
3. 找到你的产品并复制 Product ID

#### 2.2 确认产品 ID 格式

```env
# 正确格式
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_787ApJgNkvuvMhKIdWA40f

# ❌ 错误：缺少 prod_ 前缀
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=787ApJgNkvuvMhKIdWA40f

# ❌ 错误：使用了其他账户的产品 ID
```

#### 2.3 测试不同的产品

尝试使用 Dashboard 中的另一个产品 ID 测试：

```javascript
// 在浏览器控制台测试
fetch(`${window.location.origin}/api/creem/create-checkout`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    productId: 'prod_另一个产品ID',
    billingCycle: 'monthly'
  })
}).then(r => r.json()).then(console.log)
```

---

### 步骤 3：检查账户状态

#### 3.1 确认 Creem 账户已激活

- 邮箱是否已验证？
- 账户是否处于活跃状态？
- 是否有未完成的设置步骤？

#### 3.2 检查支付方式（如果适用）

某些情况下，Creem 可能要求：
- 完成账户验证
- 添加支付方式
- 完成 KYC（身份验证）

---

### 步骤 4：检查请求参数

根据 Creem 官方文档，可能还需要其他参数。

#### 4.1 添加 Customer 信息（可选但推荐）

让我更新代码添加客户信息：

```typescript
// 在 checkoutData 中添加
customer: {
  email: 'test@example.com' // 可以从用户登录信息获取
}
```

#### 4.2 添加 request_id（可选）

```typescript
request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
```

---

### 步骤 5：检查 API 限制

#### 5.1 API 调用频率限制

如果短时间内多次测试，可能触发限制。

**解决**：等待几分钟后再试。

#### 5.2 测试模式 vs 生产模式

确认你使用的是正确环境的 API Key：
- 测试环境 Key 只能用于测试
- 生产环境 Key 只能用于生产

---

## 🧪 诊断工具

### 方法 1：使用详细日志

现在代码已经添加了更详细的日志，查看终端输出：

```bash
[Creem API] Response status: 403
[Creem API] Response headers: {...}
[Creem API] Error response: {...}
[Creem API] Request was: {...}
```

### 方法 2：手动测试 Creem API

使用 curl 直接测试：

```bash
curl -X POST https://api.creem.io/v1/checkouts \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的实际API密钥" \
  -d '{
    "product_id": "prod_787ApJgNkvuvMhKIdWA40f",
    "units": 1,
    "success_url": "http://localhost:3000/success"
  }' \
  -v
```

查看返回的详细错误信息。

### 方法 3：联系 Creem 支持

如果以上都无法解决，在 Creem Dashboard 中：
1. 查找 **Support** 或 **Help**
2. 提供以下信息：
   - 错误：403 Forbidden
   - Endpoint: POST /v1/checkouts
   - 使用的 API Key（只提供前几个字符）
   - 请求的完整 payload

---

## 📝 快速检查清单

检查以下项目：

- [ ] API Key 已从 Creem Dashboard 复制
- [ ] API Key 已正确粘贴到 `.env.local`
- [ ] 没有多余的空格或换行
- [ ] API Key 类型是 Secret/Server Key
- [ ] API Key 状态是 Active（未被撤销）
- [ ] 产品 ID 格式正确（`prod_xxxxx`）
- [ ] 产品 ID 存在于同一 Creem 账户
- [ ] Creem 账户已完全激活
- [ ] 邮箱已验证
- [ ] 已重启开发服务器

---

## 💡 最可能的解决方案

根据经验，403 错误 **90% 的情况**是因为：

### 🎯 解决方案：重新生成 API Key

1. **登录 Creem Dashboard**
2. **Settings → API Keys**
3. **创建新的 API Key**（选择 "Secret Key" 类型）
4. **复制新的 API Key**
5. **更新 `.env.local`**：
   ```env
   CREEM_API_KEY=新的密钥
   ```
6. **重启开发服务器**
7. **再次测试**

---

## 🔄 测试流程

```bash
# 1. 重新生成 API Key（在 Creem Dashboard）

# 2. 更新环境变量
# 编辑 .env.local

# 3. 重启服务器
npm run dev

# 4. 测试 API
curl -X POST http://localhost:3000/api/creem/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod_787ApJgNkvuvMhKIdWA40f","billingCycle":"monthly"}'

# 5. 查看结果
# ✅ 200 OK - 成功！
# ⚠️ 400 - 参数问题（但认证通过了）
# ❌ 403 - 还是认证问题
```

---

## 📊 错误代码对照表

| 状态码 | 含义 | 解决方案 |
|-------|------|---------|
| 200 | ✅ 成功 | 完美！ |
| 400 | ⚠️ 参数错误 | 检查请求参数 |
| 401 | ❌ 未认证 | API Key 缺失 |
| **403** | ❌ **禁止访问** | **API Key 无效或权限不足** |
| 404 | ❌ 未找到 | Endpoint 错误 |
| 429 | ⚠️ 请求过多 | 等待后重试 |
| 500 | ❌ 服务器错误 | Creem 服务问题 |

---

## 🎯 下一步行动

### 立即执行：

1. **打开 Creem Dashboard**
2. **重新生成 API Key**
3. **更新 `.env.local`**
4. **重启服务器并测试**

### 如果还是 403：

提供以下信息：
```
1. Creem Dashboard 中 API Key 的类型：___
2. API Key 的状态：___
3. 产品 ID 在 Dashboard 中是否可见：___
4. 账户是否有任何警告或提示：___
5. 完整的错误响应内容：___
```

---

**最后更新时间**: 2025-10-09  
**问题**: 403 Forbidden  
**状态**: 等待用户重新生成 API Key

