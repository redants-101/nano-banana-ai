# 🧪 Creem 测试环境配置指南

## 🎯 问题解决

如果你遇到 **403 Forbidden** 错误，很可能是因为：
- ✅ 你使用的是**测试环境** API Key
- ❌ 但代码调用的是**生产环境** API URL

## 📊 Creem 环境说明

Creem 提供两个独立的环境：

| 环境 | API Base URL | 用途 |
|------|-------------|------|
| **测试环境** | `https://test-api.creem.io` | 开发和测试，不产生真实费用 |
| **生产环境** | `https://api.creem.io` | 正式运营，产生真实交易 |

⚠️ **重要**：测试环境的 API Key **只能**访问 `https://test-api.creem.io`！

---

## ✅ 配置测试环境

### 步骤 1：在 `.env.local` 中添加配置

```env
# Creem 测试环境 API Base URL（必需！）
CREEM_API_BASE_URL=https://test-api.creem.io

# Creem 测试环境 API Key
CREEM_API_KEY=your-test-api-key-here

# 测试环境产品 ID
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_test_xxxxxxxxxxxxx

# 其他配置...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 步骤 2：重启开发服务器

```bash
# 停止服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 步骤 3：验证配置

查看终端日志，应该显示：

```
[Creem API] Using environment: {
  baseUrl: 'https://test-api.creem.io',
  isTestMode: true
}
```

### 步骤 4：测试支付流程

访问：`http://localhost:3000/zh/pricing`

点击"选择方案"，应该看到：

```
[Creem API] Response status: 200  ✅ 成功！
```

---

## 🔄 从测试环境切换到生产环境

### 方法 1：修改环境变量

```env
# 1. 更改 API Base URL
CREEM_API_BASE_URL=https://api.creem.io

# 2. 更换为生产环境 API Key
CREEM_API_KEY=your-production-api-key-here

# 3. 更换为生产环境产品 ID
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxxxxxxxxxx
```

### 方法 2：使用不同的环境变量文件

```bash
# 开发/测试
.env.local          # 测试环境配置

# 生产环境
.env.production     # 生产环境配置
```

---

## 📝 完整配置示例

### 测试环境配置

```env
# ========================================
# Creem 测试环境
# ========================================

CREEM_API_BASE_URL=https://test-api.creem.io
CREEM_API_KEY=test_sk_xxxxxxxxxxxxx
CREEM_WEBHOOK_SECRET=test_whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_test_787ApJgNkvuvMhKIdWA40f
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_test_yyyyyyyyyyyyy

# ========================================
# 基础配置
# ========================================

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### 生产环境配置

```env
# ========================================
# Creem 生产环境
# ========================================

CREEM_API_BASE_URL=https://api.creem.io
CREEM_API_KEY=live_sk_xxxxxxxxxxxxx
CREEM_WEBHOOK_SECRET=live_whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_787ApJgNkvuvMhKIdWA40f
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyy

# ========================================
# 基础配置
# ========================================

NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

---

## 🧪 测试环境特点

### ✅ 优点

1. **安全测试** - 不会产生真实费用
2. **独立数据** - 测试数据不影响生产
3. **快速迭代** - 可以随意测试各种场景
4. **模拟支付** - 可以测试支付流程

### ⚠️ 注意事项

1. **API Key 分离** - 测试和生产的 Key 完全独立
2. **产品 ID 不同** - 需要在测试环境创建测试产品
3. **Webhook URL** - 测试环境需要配置独立的 webhook
4. **数据不互通** - 测试环境的订单不会出现在生产环境

---

## 🔍 如何获取测试环境 API Key

### 步骤 1：登录 Creem 测试环境

访问 Creem Dashboard，通常会有环境切换选项：
- 顶部或左侧菜单中的 "Test Mode" 开关
- 或者是独立的测试环境 URL

### 步骤 2：切换到测试模式

确保 Dashboard 显示 "Test Mode" 或 "测试模式"

### 步骤 3：获取测试 API Key

1. 进入 **Settings** → **API Keys**
2. 找到 **Test Keys** 或 **测试密钥**
3. 复制 **Secret Key** 或 **服务端密钥**

### 步骤 4：创建测试产品

1. 在测试模式下进入 **Products**
2. 创建测试产品（价格可以设置为 $0.01 等）
3. 复制测试产品的 ID

---

## 🐛 常见问题

### Q1: 403 错误，但我确定 API Key 正确

**A**: 检查 `CREEM_API_BASE_URL` 是否与 API Key 的环境匹配：
```env
# ❌ 错误：测试 Key + 生产 URL
CREEM_API_BASE_URL=https://api.creem.io
CREEM_API_KEY=test_sk_xxxxx

# ✅ 正确：测试 Key + 测试 URL
CREEM_API_BASE_URL=https://test-api.creem.io
CREEM_API_KEY=test_sk_xxxxx
```

### Q2: 如何知道我的 API Key 是测试还是生产？

**A**: 通常测试环境的 API Key 有特殊前缀：
- 测试：`test_sk_xxxxx` 或 `sk_test_xxxxx`
- 生产：`live_sk_xxxxx` 或 `sk_live_xxxxx`

### Q3: 测试环境能不能用真实支付？

**A**: 不能。测试环境通常：
- 使用模拟的支付网关
- 可以使用测试信用卡号
- 不会产生真实扣费

### Q4: 测试完成后如何切换到生产？

**A**: 
1. 更新 `CREEM_API_BASE_URL` 为 `https://api.creem.io`
2. 更换所有 Creem 相关的环境变量为生产值
3. 重新构建和部署应用
4. 使用真实信用卡测试一次小额交易

---

## 📊 环境检查清单

部署前确认：

### 测试环境 ✅
- [ ] `CREEM_API_BASE_URL=https://test-api.creem.io`
- [ ] 使用测试环境 API Key
- [ ] 使用测试环境产品 ID
- [ ] Webhook URL 指向测试服务器

### 生产环境 🚀
- [ ] `CREEM_API_BASE_URL=https://api.creem.io`
- [ ] 使用生产环境 API Key
- [ ] 使用生产环境产品 ID
- [ ] Webhook URL 指向生产服务器
- [ ] 已测试完整支付流程
- [ ] 已备份测试数据

---

## 🎯 快速修复步骤

如果你现在就想解决 403 错误：

```bash
# 1. 编辑 .env.local
# 添加这一行：
CREEM_API_BASE_URL=https://test-api.creem.io

# 2. 重启服务器
npm run dev

# 3. 测试
# 访问：http://localhost:3000/zh/pricing
# 点击"选择方案"
```

应该就能成功了！✅

---

## 📚 相关资源

- [Creem 测试环境文档](https://docs.creem.io/testing)
- [测试信用卡号](https://docs.creem.io/testing/test-cards)
- [环境变量配置](./ENV_CONFIG.md)
- [403 错误排查](./CREEM_403_TROUBLESHOOTING.md)

---

**最后更新**: 2025-10-09  
**问题**: 403 Forbidden（测试环境 vs 生产环境）  
**状态**: ✅ 已解决 - 配置 `CREEM_API_BASE_URL=https://test-api.creem.io`

