# 如何获取 Creem Product ID

## 📋 概述

Product ID 是 Creem 平台上每个订阅产品的唯一标识符。你需要为不同的订阅方案（月付/年付）创建对应的产品。

## 🚀 完整步骤（5-10分钟）

### 第一步：注册 Creem 账户

1. 访问 [Creem 官网](https://creem.io)
2. 点击 **Sign Up**（注册）
3. 填写信息：
   - 邮箱
   - 密码
   - 公司名称（可以填 "Nano Banana AI"）
4. 验证邮箱

---

### 第二步：进入 Dashboard

1. 登录后，你会看到 Creem Dashboard（控制面板）
2. 左侧菜单找到 **Products**（产品）
3. 点击进入产品管理页面

---

### 第三步：创建专业版月付产品

#### 3.1 点击 "Create Product"（创建产品）

你会看到一个表单，需要填写以下信息：

#### 3.2 填写产品信息

**基本信息**：
- **Name**（名称）: `Nano Banana Pro - Monthly`
- **Description**（描述）: `Professional plan with 500 generations per month, HD quality, and all advanced features`

**定价信息**：
- **Price**（价格）: `19`
- **Currency**（货币）: `USD` (美元)
- **Billing Interval**（计费周期）: `Monthly`（每月）
- **Billing Period**（计费周期长度）: `1 month`

**功能说明**（可选）：
```
✓ 500 generations per month
✓ HD image quality (4K)
✓ Batch processing (up to 9 images)
✓ Character consistency
✓ Scene preservation
✓ Priority processing queue
✓ Email support
```

#### 3.3 保存并获取 Product ID

1. 点击 **Save** 或 **Create Product**
2. 创建成功后，你会看到产品详情页
3. 找到 **Product ID**，格式类似：`prod_abc123xyz456`
4. **复制这个 ID**，这就是月付的 Product ID ✅

```
示例：
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_abc123xyz456
```

---

### 第四步：创建专业版年付产品

重复第三步的流程，但使用不同的参数：

#### 4.1 创建新产品

再次点击 **Create Product**

#### 4.2 填写年付产品信息

**基本信息**：
- **Name**（名称）: `Nano Banana Pro - Yearly`
- **Description**（描述）: `Professional plan - Save 20% with annual billing`

**定价信息**：
- **Price**（价格）: `190`
- **Currency**（货币）: `USD`
- **Billing Interval**（计费周期）: `Yearly`（每年）
- **Billing Period**（计费周期长度）: `1 year`

#### 4.3 获取年付 Product ID

1. 保存产品
2. 复制这个产品的 **Product ID** ✅

```
示例：
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_def789uvw012
```

---

## 📝 配置到项目中

### 第五步：添加到环境变量

打开项目根目录的 `.env.local` 文件，添加：

```env
# Creem Product IDs
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_abc123xyz456
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_def789uvw012
```

⚠️ **注意**：
- 替换为你实际获取的 Product ID
- 不要有多余的空格
- 不要包含引号

### 第六步：重启开发服务器

```bash
# 停止服务器（Ctrl+C）
# 重新启动
npm run dev
```

---

## ✅ 验证配置

### 检查是否生效

1. 访问定价页面：`http://localhost:3000/zh/pricing`
2. 点击专业版的"选择方案"按钮
3. 如果配置正确：
   - ✅ 会跳转到 Creem 支付页面
   - ✅ 显示正确的价格（$19 或 $190）

4. 如果配置错误：
   - ❌ 仍然提示"支付功能尚未配置"
   - ❌ 检查 Product ID 是否正确复制

---

## 🎯 完整配置示例

假设你创建了两个产品，获得的 Product ID 是：

| 产品 | Product ID |
|------|-----------|
| 月付 | prod_cm3abc123xyz |
| 年付 | prod_cm3def456uvw |

那么你的 `.env.local` 应该包含：

```env
# Creem API Key
CREEM_API_KEY=creem_sk_live_abc123def456
CREEM_WEBHOOK_SECRET=whsec_xyz789abc456

# Creem Product IDs
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_cm3abc123xyz
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_cm3def456uvw

# Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
```

---

## 🖼️ 截图参考（如果需要）

Creem Dashboard 的界面大致是这样的：

```
┌─────────────────────────────────────────┐
│  Creem Dashboard                        │
├─────────────────────────────────────────┤
│  ☰ Menu                                 │
│    • Overview                           │
│    • Products  ← 在这里                 │
│    • Customers                          │
│    • Payments                           │
│    • Settings                           │
├─────────────────────────────────────────┤
│  Products                               │
│                                         │
│  [+ Create Product]                     │
│                                         │
│  📦 Nano Banana Pro - Monthly           │
│      prod_abc123xyz456  ← 复制这个      │
│      $19/month                          │
│                                         │
│  📦 Nano Banana Pro - Yearly            │
│      prod_def789uvw012  ← 复制这个      │
│      $190/year                          │
└─────────────────────────────────────────┘
```

---

## ❓ 常见问题

### Q1: 找不到 Product ID 在哪里？

**A**: Product ID 通常显示在：
1. 产品列表页（每个产品卡片上）
2. 产品详情页（标题下方）
3. 有时标记为 "ID"、"Product ID" 或 "API ID"

### Q2: 可以用同一个 Product ID 吗？

**A**: 不行！月付和年付必须是两个不同的产品：
- ❌ 不能用同一个 ID
- ✅ 必须创建两个产品，获取两个不同的 ID

**原因**：
- 价格不同（$19 vs $190）
- 计费周期不同（月 vs 年）
- Creem 需要区分它们

### Q3: 测试环境和生产环境的 Product ID 一样吗？

**A**: 通常不一样！

- **测试环境**（Test Mode）: 使用测试 Product ID
  - 例如：`prod_test_abc123`
  - 不会真实扣款

- **生产环境**（Live Mode）: 使用正式 Product ID  
  - 例如：`prod_live_xyz789`
  - 会真实扣款

建议：
1. 开发阶段用测试环境 ID
2. 上线前切换到生产环境 ID

### Q4: 创建产品时需要绑定银行账户吗？

**A**: 取决于 Creem 的要求：
- **测试模式**：通常不需要
- **生产模式**：需要绑定才能收款

你可以先在测试模式创建产品进行开发。

### Q5: Product ID 会变化吗？

**A**: 不会！一旦创建：
- ✅ Product ID 是永久的
- ✅ 可以修改产品的价格、描述等
- ✅ 但 Product ID 不会改变

### Q6: 如果输入错误的 Product ID 会怎样？

**A**: 会看到错误提示：
```
支付初始化失败！

错误信息：Product not found

可能的原因：
1. Product ID 不正确
2. Product 已被删除
3. 使用了测试环境 ID 但配置的是生产 API Key
```

---

## 🔒 安全提示

### 为什么 Product ID 要用 `NEXT_PUBLIC_` 前缀？

```env
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxx  ✅ 可以在客户端使用
CREEM_API_KEY=creem_sk_xxxxx                 ⚠️ 只能在服务端使用
```

**原因**：
- Product ID 是**公开信息**，不是敏感数据
- 用户浏览器需要知道要买哪个产品
- API Key 是**敏感信息**，绝对不能暴露给客户端

### 什么是敏感信息？

| 配置项 | 敏感性 | 可否公开 |
|--------|--------|---------|
| Product ID | ✅ 公开 | 可以在前端使用 |
| API Key | ⚠️ 敏感 | 只能在服务端 |
| Webhook Secret | ⚠️ 敏感 | 只能在服务端 |

---

## 🎉 完成检查清单

配置完成后，检查以下项目：

- [ ] 在 Creem 创建了月付产品
- [ ] 在 Creem 创建了年付产品
- [ ] 复制了两个 Product ID
- [ ] 添加到 `.env.local` 文件
- [ ] Product ID 格式正确（`prod_` 开头）
- [ ] 重启了开发服务器
- [ ] 访问 `/pricing` 页面测试
- [ ] 点击"选择方案"可以跳转到 Creem

---

## 📚 相关文档

- [Creem 完整设置指南](./CREEM_SETUP.md)
- [环境变量配置说明](./ENV_CONFIG.md)
- [定价页面测试指南](./PRICING_QUICK_TEST.md)

---

## 💡 小贴士

1. **保存好 Product ID**：创建后立即复制保存
2. **命名清晰**：使用易识别的产品名称（如 "Pro - Monthly"）
3. **测试优先**：先用测试模式熟悉流程
4. **文档记录**：把 Product ID 记录在安全的地方（如密码管理器）

如有其他问题，欢迎查看 [Creem 官方文档](https://docs.creem.io)！

