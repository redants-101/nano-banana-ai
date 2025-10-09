# ✅ Creem API 已修复 - 立即测试！

## 🎉 修复完成

已根据 Creem 官方文档更新 API 配置：

### 修改内容
- ✅ **API Endpoint**: 从 `/v1/checkout/sessions` 改为 `/v1/checkouts` ⚡
- ✅ **认证方式**: 使用 `x-api-key` header
- ✅ **请求参数**: 更新为 Creem 官方格式
  - 添加 `units: 1`
  - 移除 `billing_cycle` 参数（产品中已定义）
  - 移除 `cancel_url`（Creem 不需要）

### 最终配置
```javascript
URL: https://api.creem.io/v1/checkouts
Method: POST
Headers: {
  'Content-Type': 'application/json',
  'x-api-key': YOUR_API_KEY
}
Body: {
  product_id: "prod_xxxxx",
  units: 1,
  success_url: "http://localhost:3000/payment/success",
  metadata: { ... }
}
```

---

## 🧪 现在立即测试！

### 方法 1：浏览器测试（推荐）

1. **确保开发服务器正在运行**
   ```bash
   npm run dev
   ```

2. **访问定价页面**
   ```
   http://localhost:3000/zh/pricing
   ```

3. **点击专业版的"选择方案"按钮**

4. **打开浏览器控制台（F12）查看日志**
   你应该看到：
   ```
   [Payment] Calling API: http://localhost:3000/api/creem/create-checkout
   [Payment] API Response status: 200 ← 成功！
   ```
   
   或者：
   ```
   [Payment] API Response status: 400
   ```
   如果是 400，查看错误信息可能是产品 ID 的问题。

5. **如果成功**
   - 会自动跳转到 Creem 支付页面 🎉
   - 或者显示一个包含支付链接的响应

---

### 方法 2：命令行测试

在项目目录中运行：

```bash
curl -X POST http://localhost:3000/api/creem/create-checkout \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"prod_787ApJgNkvuvMhKIdWA40f\",\"billingCycle\":\"monthly\"}"
```

**预期结果：**
- ✅ **200 OK**: `{"checkoutUrl": "https://...", "success": true}`
- ⚠️ **400 Bad Request**: 可能是产品 ID 问题
- ❌ **401 Unauthorized**: API Key 错误
- ❌ **404 Not Found**: 说明还有问题（但应该不会了！）

---

### 方法 3：使用诊断工具

访问：
```
http://localhost:3000/test-payment-debug.html
```

点击 "🔍 运行完整诊断"

---

## 📊 查看服务器日志

在终端中你会看到详细的日志：

```
[Creem API] Creating checkout session: {
  productId: 'prod_787ApJgNkvuvMhKIdWA40f',
  billingCycle: 'monthly',
  siteUrl: 'http://localhost:3000',
  apiUrl: 'https://api.creem.io/v1/checkouts',
  checkoutData: { product_id: '...', units: 1, ... }
}
[Creem API] Response status: 200        ← 看这里！
[Creem API] Checkout created successfully: { ... }
```

---

## 🎯 预期结果

### ✅ 成功情况
- HTTP 状态码：**200 OK**
- 响应包含：`checkoutUrl`
- 浏览器自动跳转到 Creem 支付页面
- 终端显示：`[Creem API] Checkout created successfully`

### ⚠️ 可能的问题

#### 1. 400 Bad Request
**原因**: 产品 ID 不正确或不存在

**解决**: 
- 检查 `.env.local` 中的 `NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID`
- 确保产品 ID 存在于你的 Creem Dashboard 中
- 产品 ID 格式：`prod_xxxxxxxxxxxxx`

#### 2. 401 Unauthorized
**原因**: API Key 不正确

**解决**:
- 检查 `.env.local` 中的 `CREEM_API_KEY`
- 在 Creem Dashboard 中重新生成 API Key
- 确保没有多余的空格或换行

#### 3. 500 Internal Server Error
**原因**: Creem API 响应格式不符合预期

**解决**:
- 查看终端日志中的详细错误信息
- 检查 Creem API 返回的响应格式
- 可能需要调整字段映射

---

## 📝 环境变量检查清单

确保 `.env.local` 包含：

```env
# Creem API Key（必需）
CREEM_API_KEY=your-creem-api-key-here

# 产品 ID（必需）
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_787ApJgNkvuvMhKIdWA40f

# 年付产品 ID（可选）
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyy

# 网站 URL（必需）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **修改环境变量后必须重启开发服务器！**

---

## 🚀 快速测试命令

```bash
# 1. 确保服务器运行中
npm run dev

# 2. 在新终端测试 API
curl -X POST http://localhost:3000/api/creem/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod_787ApJgNkvuvMhKIdWA40f","billingCycle":"monthly"}'

# 3. 查看环境变量
curl http://localhost:3000/api/check-env

# 4. 在浏览器中测试
# 访问：http://localhost:3000/zh/pricing
# 点击"选择方案"按钮
```

---

## 📞 如果还有问题

### 查看完整的错误日志

1. **浏览器控制台**（F12）
   - Console 标签：查看 JavaScript 错误
   - Network 标签：查看 HTTP 请求详情

2. **开发服务器终端**
   - 查看 `[Creem API]` 开头的日志
   - 特别注意 `Response status` 和错误信息

3. **提供以下信息**
   ```
   - HTTP 状态码：___
   - 错误信息：___
   - 终端日志：___
   ```

---

## 🎉 成功后的下一步

如果测试成功：

1. ✅ **测试年付订阅**
   - 切换到"年付"
   - 点击"选择方案"
   - 验证是否使用正确的年付产品 ID

2. ✅ **测试支付流程**
   - 在 Creem 支付页面填写测试信息
   - 完成支付（如果有测试模式）
   - 验证回调 URL

3. ✅ **配置 Webhook**
   - 参考：`docs/CREEM_SETUP.md`
   - 配置支付完成后的通知

---

**现在就去测试吧！** 🚀

如果成功，你会看到 Creem 的支付页面！
如果失败，把错误信息发给我，我会立即帮你解决！

---

**最后更新时间**: 2025-10-09
**状态**: ✅ 已修复，等待测试

