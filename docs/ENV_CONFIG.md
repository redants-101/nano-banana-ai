# 环境变量配置指南

本文档详细说明 Nano Banana AI 项目所需的所有环境变量配置。

## 📋 概述

环境变量存储在项目根目录的 `.env.local` 文件中。该文件包含敏感信息，**不应提交到 Git 仓库**。

## 🚀 快速开始

### 1. 创建配置文件

在项目根目录创建 `.env.local` 文件：

**Windows 用户**:
```bash
# 使用命令提示符
type nul > .env.local

# 或使用 PowerShell
New-Item -Path .env.local -ItemType File
```

**Mac/Linux 用户**:
```bash
touch .env.local
```

### 2. 复制配置模板

将以下内容复制到 `.env.local` 文件中：

```env
# ========================================
# OpenRouter API (必需)
# ========================================
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ========================================
# Supabase 配置 (必需)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ========================================
# Creem 支付配置 (可选)
# ========================================
CREEM_API_KEY=creem_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CREEM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyyyyy

# ========================================
# 应用配置
# ========================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nano Banana AI Image Editor
```

## 📖 详细配置说明

### 必需配置

#### 1. OpenRouter API Key

用于调用 Gemini 2.5 Flash Image 模型。

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**获取方法**:
1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册并登录账户
3. 进入 **Keys** 页面
4. 创建新的 API Key
5. 复制 Key（格式：`sk-or-v1-...`）

**用途**: 
- AI 图像生成和编辑
- 自然语言图像处理

#### 2. Supabase URL

Supabase 项目的 URL 地址。

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
```

**获取方法**:
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择或创建项目
3. 进入 **Settings** → **API**
4. 复制 **Project URL**

**用途**:
- 用户认证
- 数据存储
- 订阅管理

#### 3. Supabase Anon Key

Supabase 匿名密钥（公开使用）。

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**获取方法**:
1. 在 Supabase Dashboard 的 **Settings** → **API** 页面
2. 复制 **anon/public** key

**用途**:
- 客户端 Supabase 调用
- 用户登录和注册

#### 4. Supabase Service Role Key

Supabase 服务角色密钥（服务端使用，敏感信息）。

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**获取方法**:
1. 在 Supabase Dashboard 的 **Settings** → **API** 页面
2. 复制 **service_role** key（⚠️ 不是 anon key）

**用途**:
- Webhook 处理
- 绕过 RLS 策略
- 管理员操作

⚠️ **重要**: 此密钥拥有完全访问权限，仅用于服务端，切勿在客户端代码中使用！

### 可选配置（订阅功能）

如果不需要订阅支付功能，可以跳过此部分配置。

#### 5. Creem API Key

Creem 支付平台的 API 密钥。

```env
CREEM_API_KEY=creem_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**获取方法**:
1. 访问 [Creem](https://creem.io)
2. 注册并登录账户
3. 进入 **Settings** → **API Keys**
4. 创建新的 API Key
5. 复制 Key

**用途**:
- 创建支付会话
- 管理订阅

📖 详细配置: [Creem 设置指南](./CREEM_SETUP.md)

#### 6. Creem Webhook Secret

用于验证 Creem Webhook 签名。

```env
CREEM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**获取方法**:
1. 在 Creem Dashboard 的 **Settings** → **Webhooks** 页面
2. 创建 Webhook Endpoint
3. 复制 **Signing Secret**

**用途**:
- 验证 Webhook 请求的真实性
- 防止伪造的支付通知

#### 7. Creem 产品 ID

Creem 平台上创建的产品 ID。

```env
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyyyyy
```

**获取方法**:
1. 在 Creem Dashboard 的 **Products** 页面
2. 创建两个产品：
   - Pro Monthly: $19/月
   - Pro Yearly: $190/年
3. 复制每个产品的 ID

**用途**:
- 创建支付会话时指定产品
- 区分不同的订阅方案

### 应用配置

#### 8. 网站 URL

应用的访问 URL。

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**配置说明**:
- **开发环境**: `http://localhost:3000`
- **生产环境**: `https://your-domain.com`（必须使用实际域名）

**用途**:
- 支付回调 URL
- OAuth 回调 URL
- 分享链接

⚠️ **重要**: 生产环境必须配置为实际的域名，不能使用 localhost！

#### 9. 网站名称

应用的显示名称（可选）。

```env
NEXT_PUBLIC_SITE_NAME=Nano Banana AI Image Editor
```

**用途**:
- 页面标题
- 邮件通知
- 分享信息

## 🔒 安全最佳实践

### 1. 保护敏感信息

- ✅ 将 `.env.local` 添加到 `.gitignore`
- ❌ 不要将环境变量提交到 Git
- ❌ 不要在客户端代码中使用 Service Role Key
- ❌ 不要在公开场合分享 API Key

### 2. 环境变量命名规则

- **`NEXT_PUBLIC_*`**: 会暴露给客户端，可以在浏览器中访问
- **无前缀**: 仅在服务端可用，不会暴露给客户端

示例：
```javascript
// 客户端可用
const url = process.env.NEXT_PUBLIC_SUPABASE_URL

// 仅服务端可用
const apiKey = process.env.CREEM_API_KEY
```

### 3. 密钥轮换

定期更换 API Key：
- OpenRouter API Key: 每 3-6 个月
- Creem API Key: 每 6 个月
- 如发现泄露，立即更换

## 🐛 故障排查

### 问题 1: 找不到环境变量

**症状**: `process.env.XXX` 返回 `undefined`

**解决方法**:
1. 确认 `.env.local` 文件在项目根目录
2. 确认变量名拼写正确
3. 重启开发服务器（`npm run dev`）
4. 客户端使用的变量必须以 `NEXT_PUBLIC_` 开头

### 问题 2: API Key 无效

**症状**: API 调用返回 401 或 403 错误

**解决方法**:
1. 检查 API Key 是否正确复制（没有多余空格）
2. 确认 API Key 未过期
3. 检查 API Key 的权限设置

### 问题 3: Supabase 连接失败

**症状**: 无法登录或数据库操作失败

**解决方法**:
1. 确认 `NEXT_PUBLIC_SUPABASE_URL` 格式正确
2. 确认 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是 anon key，不是 service_role key
3. 检查 Supabase 项目状态（是否暂停）

### 问题 4: 支付功能不工作

**症状**: 点击订阅按钮后无反应

**解决方法**:
1. 确认 Creem 相关环境变量已配置
2. 检查 `NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID` 是否正确
3. 查看浏览器控制台错误信息
4. 检查 Creem Dashboard 中的产品状态

## 📝 检查清单

使用此清单确认配置完整：

- [ ] 创建了 `.env.local` 文件
- [ ] 配置了 `OPENROUTER_API_KEY`
- [ ] 配置了 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 配置了 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 配置了 `SUPABASE_SERVICE_ROLE_KEY`
- [ ] （可选）配置了 Creem 相关变量
- [ ] 配置了 `NEXT_PUBLIC_SITE_URL`
- [ ] `.env.local` 在 `.gitignore` 中
- [ ] 重启了开发服务器

## 🔗 相关文档

- [Creem 设置指南](./CREEM_SETUP.md)
- [数据库设置指南](./DATABASE_SETUP.md)
- [Supabase 配置指南](./SUPABASE_SETUP.md)
- [生产环境部署指南](./PRODUCTION_DEPLOYMENT.md)

## ❓ 获取帮助

如果遇到配置问题：

1. 查看 [常见问题解答](../README.md#常见问题)
2. 查看项目 Issues
3. 联系技术支持

