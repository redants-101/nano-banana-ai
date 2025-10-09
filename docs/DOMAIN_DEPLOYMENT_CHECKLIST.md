# 🌐 域名部署检查清单

## 📋 通过域名访问项目时的配置要点

当你通过自定义域名（而不是 localhost）访问项目时，需要确保以下配置正确。

---

## ✅ 必需的配置更新

### 1. 环境变量配置

#### `.env.local` 或 `.env.production`

```env
# ❌ 错误：使用 localhost
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ✅ 正确：使用你的实际域名
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 或者，如果是自定义端口
NEXT_PUBLIC_SITE_URL=https://your-domain.com:3000
```

**重要提示：**
- 修改后必须重新构建和重启：
  ```bash
  npm run build
  npm run start
  ```
- 开发环境：重启 `npm run dev`

---

### 2. Creem 回调 URL 配置

Creem 支付完成后会重定向到 `success_url`，确保：

#### 当前配置（已优化）：
```javascript
success_url: `${siteUrl}/${locale}/payment/success`
// 例如：https://your-domain.com/zh/payment/success
```

#### 在 Creem Dashboard 中添加允许的回调域名：

1. 登录 Creem Dashboard
2. 进入 **Settings** → **Domains** 或 **Allowed Origins**
3. 添加你的域名：
   ```
   https://your-domain.com
   ```

---

### 3. CORS 和域名白名单

某些支付服务要求配置允许的域名：

#### Creem Dashboard 设置：
- **Allowed Domains**: 添加你的域名
- **Webhook URLs**: 确保使用正确的域名
  ```
  https://your-domain.com/api/creem/webhook
  ```

---

## 🔍 403 错误的域名相关原因

### 可能原因 1：域名未在 Creem 中注册

**解决方案：**
1. 登录 Creem Dashboard
2. 检查是否有 "Domains" 或 "Allowed Origins" 设置
3. 添加你的域名到白名单

### 可能原因 2：API Key 绑定了特定域名

某些 API Key 可能限制只能从特定域名调用。

**解决方案：**
1. 在 Creem Dashboard 中检查 API Key 的限制
2. 如果有域名限制，添加你的域名
3. 或创建一个新的无限制的 API Key

### 可能原因 3：回调 URL 格式不正确

Creem 可能验证 `success_url` 的域名。

**解决方案：**
确保 `NEXT_PUBLIC_SITE_URL` 配置正确：
```env
# ✅ 带协议（https:// 或 http://）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# ❌ 缺少协议
NEXT_PUBLIC_SITE_URL=your-domain.com

# ❌ 多余的斜杠
NEXT_PUBLIC_SITE_URL=https://your-domain.com/
```

---

## 🧪 验证配置

### 1. 检查当前配置

访问这个 API 查看配置：
```
https://your-domain.com/api/check-env
```

确认：
```json
{
  "basic": {
    "NEXT_PUBLIC_SITE_URL": {
      "value": "✅ 已配置",
      "actual": "https://your-domain.com"  // 应该是你的域名
    }
  }
}
```

### 2. 测试支付流程

```bash
# 使用你的域名测试
curl -X POST https://your-domain.com/api/creem/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod_787ApJgNkvuvMhKIdWA40f","billingCycle":"monthly"}'
```

### 3. 查看完整的请求日志

现在代码已经添加了详细日志，查看：
```bash
[Creem API] Site configuration: {
  siteUrl: 'https://your-domain.com',
  successUrl: 'https://your-domain.com/zh/payment/success',
  ...
}
```

---

## 📝 部署环境检查清单

部署到生产环境时检查：

### 环境变量
- [ ] `NEXT_PUBLIC_SITE_URL` 设置为生产域名
- [ ] 所有 `NEXT_PUBLIC_*` 变量已配置
- [ ] `CREEM_API_KEY` 使用生产环境 Key
- [ ] 重新构建了应用（`npm run build`）

### Creem Dashboard
- [ ] 生产域名已添加到白名单
- [ ] Webhook URL 使用生产域名
- [ ] API Key 权限正确
- [ ] API Key 未绑定到 localhost

### DNS 和 SSL
- [ ] DNS 解析正确
- [ ] SSL 证书有效（HTTPS）
- [ ] 防火墙允许必要的端口

### 测试
- [ ] 在实际域名下测试支付流程
- [ ] 测试回调 URL 是否正确
- [ ] 测试成功和失败的情况

---

## 🔧 快速修复步骤

如果你现在就通过域名访问并遇到 403：

### Step 1: 更新环境变量
```env
# .env.local 或 .env.production
NEXT_PUBLIC_SITE_URL=https://你的实际域名.com
```

### Step 2: 重启服务
```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm run start
```

### Step 3: 在 Creem Dashboard 中添加域名
1. Settings → Domains
2. 添加：`https://你的实际域名.com`

### Step 4: 测试
```bash
# 访问定价页面
https://你的实际域名.com/zh/pricing

# 点击订阅按钮测试
```

---

## 💡 常见域名相关问题

### 问题 1: localhost 可以，域名不行
**原因**: Creem API Key 可能限制了域名  
**解决**: 在 Creem 中添加域名白名单

### 问题 2: HTTP 可以，HTTPS 不行
**原因**: SSL 证书或混合内容问题  
**解决**: 确保所有请求都使用 HTTPS

### 问题 3: 主域名可以，子域名不行
**原因**: 需要分别添加每个子域名  
**解决**: 在 Creem 中添加子域名

### 问题 4: 回调失败
**原因**: `success_url` 使用了错误的域名  
**解决**: 检查 `NEXT_PUBLIC_SITE_URL` 配置

---

## 📞 如果还是 403

提供以下信息以便诊断：

1. **你的访问方式：**
   ```
   - 域名：___
   - 协议：HTTP / HTTPS
   - 端口：___
   ```

2. **环境变量：**
   ```
   NEXT_PUBLIC_SITE_URL=___
   ```

3. **Creem 配置：**
   ```
   - 是否添加了域名白名单？
   - API Key 是否有域名限制？
   ```

4. **完整的错误日志：**
   ```
   [Creem API] Site configuration: { ... }
   [Creem API] Response status: 403
   [Creem API] Error response: { ... }
   ```

---

**最后更新**: 2025-10-09  
**适用场景**: 通过自定义域名访问项目

