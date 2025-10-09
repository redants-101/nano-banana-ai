# 环境变量检查工具

## 📋 概述

这个工具可以帮助你快速检查项目的环境变量配置状态，诊断配置问题。

## 🚀 使用方法

### 方法 1：浏览器访问
```
http://localhost:3000/api/check-env
```

### 方法 2：命令行（curl）
```bash
curl http://localhost:3000/api/check-env | json_pp
```

### 方法 3：浏览器控制台
```javascript
fetch('/api/check-env')
  .then(res => res.json())
  .then(data => console.log(data))
```

## 📊 返回结果示例

```json
{
  "success": true,
  "summary": {
    "total": 11,
    "configured": 8,
    "required": 7,
    "optional": 4,
    "status": "✅ 基本配置完成"
  },
  "details": {
    "basic": {
      "NEXT_PUBLIC_SITE_URL": {
        "value": "✅ 已配置",
        "actual": "http://localhost:3000"
      },
      "NEXT_PUBLIC_SITE_NAME": {
        "value": "⚠️ 未配置（可选）",
        "actual": "undefined"
      }
    },
    "supabase": {
      "NEXT_PUBLIC_SUPABASE_URL": {
        "value": "✅ 已配置",
        "actual": "https://xxxxx.supabase.co..."
      },
      "NEXT_PUBLIC_SUPABASE_ANON_KEY": {
        "value": "✅ 已配置",
        "actual": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
      },
      "SUPABASE_SERVICE_ROLE_KEY": {
        "value": "✅ 已配置",
        "actual": "***已配置（隐藏）***"
      }
    },
    "creem": {
      "CREEM_API_KEY": {
        "value": "✅ 已配置",
        "actual": "***已配置（隐藏）***"
      },
      "CREEM_WEBHOOK_SECRET": {
        "value": "✅ 已配置",
        "actual": "***已配置（隐藏）***"
      },
      "NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID": {
        "value": "✅ 已配置",
        "actual": "prod_xxxxxxxxxxxxx"
      },
      "NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID": {
        "value": "⚠️ 未配置（年付订阅需要）",
        "actual": "undefined"
      }
    },
    "ai": {
      "OPENROUTER_API_KEY": {
        "value": "✅ 已配置",
        "actual": "sk-or-v1-xxx..."
      }
    }
  },
  "recommendations": [
    "🎉 所有关键环境变量都已正确配置！"
  ]
}
```

## 🔍 配置状态说明

| 状态图标 | 说明 |
|---------|------|
| ✅ | 已正确配置 |
| ⚠️ | 未配置（可选项） |
| ❌ | 未配置（必需项） |

## 📝 环境变量清单

### 基础配置
- `NEXT_PUBLIC_SITE_URL` - 网站 URL（必需）
- `NEXT_PUBLIC_SITE_NAME` - 网站名称（可选）

### Supabase 配置（用户认证）
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 项目 URL（必需）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 匿名密钥（必需）
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase 服务角色密钥（必需）

### Creem 支付配置（支付功能）
- `CREEM_API_KEY` - Creem API 密钥（可选）
- `CREEM_WEBHOOK_SECRET` - Creem Webhook 密钥（可选）
- `NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID` - Pro 版产品 ID（可选）
- `NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID` - Pro 年付产品 ID（可选）

### AI 配置（图像处理）
- `OPENROUTER_API_KEY` - OpenRouter API 密钥（必需）

## 🛠️ 配置步骤

### 1. 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件：

```bash
# Windows
type nul > .env.local

# macOS/Linux
touch .env.local
```

### 2. 添加环境变量

根据检查结果，将缺失的环境变量添加到 `.env.local` 文件中。

**最小配置（仅核心功能）：**
```env
OPENROUTER_API_KEY=your-api-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**完整配置（包含所有功能）：**
```env
# 基础配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nano Banana AI Image Editor

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Creem 支付配置
CREEM_API_KEY=your-creem-api-key
CREEM_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_CREEM_PRO_YEARLY_PRODUCT_ID=prod_yyyyyyyyyyyyy

# AI 配置
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 重启开发服务器

修改环境变量后，必须重启开发服务器：

```bash
# 停止服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

### 4. 验证配置

重新访问检查 API：
```
http://localhost:3000/api/check-env
```

## ⚠️ 安全提示

1. **不要提交 .env.local 文件到 Git**
   - 该文件已在 `.gitignore` 中
   - 包含敏感信息，切勿分享

2. **检查 API 仅在开发环境使用**
   - 生产环境应该禁用此 API
   - 或添加身份验证保护

3. **定期更新密钥**
   - 如果密钥泄露，立即更换
   - 定期轮换重要密钥

## 🔗 相关文档

- [环境变量配置指南](./ENV_CONFIG.md)
- [Supabase 设置指南](./SUPABASE_SETUP.md)
- [Creem 支付设置](./CREEM_SETUP.md)
- [数据库设置指南](./DATABASE_SETUP.md)

## 💡 故障排查

### 问题：所有环境变量显示 "undefined"

**解决方案：**
1. 确认 `.env.local` 文件在项目根目录
2. 检查文件格式是否正确（键=值，无空格）
3. 重启开发服务器

### 问题：修改环境变量后没有生效

**解决方案：**
1. 必须重启开发服务器
2. 清除浏览器缓存
3. 检查是否在正确的文件中修改

### 问题：NEXT_PUBLIC_* 变量无法在客户端访问

**解决方案：**
1. 确保变量名以 `NEXT_PUBLIC_` 开头
2. 重启开发服务器
3. 检查是否拼写错误

---

**最后更新时间：** 2025-10-09
**维护者：** Claude AI Assistant

