# 🚀 生产环境部署指南

## 环境信息
- **域名**: editwithwords.it.com
- **IP**: 216.198.79.1
- **Node.js 版本要求**: 18+

---

## ⚠️ 常见问题排查：图片生成失败

如果在生产环境遇到"图片生成失败"错误，请按以下步骤逐一排查：

### 快速诊断：使用健康检查端点 🩺

我们提供了一个健康检查端点，可以快速诊断配置问题：

```bash
# 访问您的生产环境健康检查端点
curl https://editwithwords.it.com/api/health-check

# 或在浏览器中直接访问
https://editwithwords.it.com/api/health-check
```

**正常的响应示例**：
```json
{
  "timestamp": "2025-10-05T12:34:56.789Z",
  "service": "Nano Banana AI Image Editor",
  "diagnostics": {
    "status": "ok",
    "warnings": [],
    "errors": []
  },
  "config": {
    "apiKey": {
      "configured": true,
      "length": 64,
      "preview": "sk-or-v1-..."
    },
    "siteUrl": {
      "configured": true,
      "value": "https://editwithwords.it.com",
      "isLocalhost": false
    }
  }
}
```

**如果有问题，会显示错误和警告**：
```json
{
  "diagnostics": {
    "status": "error",
    "errors": [
      "OPENROUTER_API_KEY is not configured"
    ],
    "warnings": [
      "NEXT_PUBLIC_SITE_URL is set to localhost in production environment"
    ]
  }
}
```

---

### 第一步：检查环境变量配置 ⭐⭐⭐（最重要）

**必须在生产环境配置以下环境变量：**

```bash
# 必需：OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxx

# 必需：生产环境网站 URL（注意不要用 localhost）
NEXT_PUBLIC_SITE_URL=https://editwithwords.it.com

# 可选：网站名称
NEXT_PUBLIC_SITE_NAME=Nano Banana AI Image Editor
```

#### 如何配置环境变量？

**方案一：使用 .env.production 文件**（推荐）
```bash
# 在项目根目录创建 .env.production 文件
# 添加上述环境变量
```

**方案二：在服务器/平台配置**
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- 自建服务器: 使用 export 命令或 .env 文件

#### 验证环境变量是否生效

在服务器上运行：
```bash
# 检查 API Key 是否已设置
echo $OPENROUTER_API_KEY

# 检查网站 URL 是否已设置
echo $NEXT_PUBLIC_SITE_URL
```

---

### 第二步：查看服务器日志

我已经在 API 路由中添加了详细的日志输出。请检查生产环境的日志：

#### 正常的日志应该显示：
```
=== 图片生成请求开始 ===
时间: 2025-10-05T12:34:56.789Z
语言: zh
提示词: [用户的提示词]
环境配置:
  - API Key 已配置: true
  - API Key 长度: 64
  - Site URL: https://editwithwords.it.com
  - Site Name: Nano Banana AI Image Editor
```

#### 如果出现以下错误日志：

**错误 1: API Key 未配置**
```
❌ 严重错误: OPENROUTER_API_KEY 未配置！
```
**解决方案**: 立即在生产环境配置 `OPENROUTER_API_KEY`

**错误 2: API Key 长度为 0**
```
  - API Key 已配置: false
  - API Key 长度: 0
```
**解决方案**: 检查环境变量是否正确设置，可能是拼写错误或未重启服务

**错误 3: Site URL 仍然是 localhost**
```
  - Site URL: http://localhost:3000
```
**解决方案**: 配置 `NEXT_PUBLIC_SITE_URL=https://editwithwords.it.com`

---

### 第三步：验证 API Key 有效性

1. **登录 OpenRouter 平台**
   - 访问: https://openrouter.ai/
   - 检查 API Key 是否过期或被禁用
   - 检查账户余额是否充足

2. **测试 API Key**（在本地测试）
   ```bash
   curl -X POST https://openrouter.ai/api/v1/chat/completions \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "HTTP-Referer: https://editwithwords.it.com" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "google/gemini-2.5-flash-image-preview",
       "messages": [{"role": "user", "content": "Hello"}]
     }'
   ```

---

### 第四步：检查网络和防火墙

确保生产服务器可以访问：
- ✅ `https://openrouter.ai/api/v1/*`
- ✅ 允许出站 HTTPS 请求（端口 443）

测试网络连接：
```bash
# 测试是否能访问 OpenRouter
curl -I https://openrouter.ai/api/v1/

# 应该返回 200 或 401（401 表示连接正常但需要认证）
```

---

### 第五步：重新部署

配置环境变量后，必须重新构建和部署：

```bash
# 1. 清除旧的构建
rm -rf .next

# 2. 重新构建（确保环境变量已设置）
npm run build

# 3. 启动生产服务器
npm start
```

**注意**: 
- 在 Vercel/Netlify 等平台，修改环境变量后需要触发重新部署
- 某些平台需要区分 Build 时环境变量和 Runtime 环境变量
- `NEXT_PUBLIC_*` 前缀的变量在构建时就会被嵌入代码中

---

## 📋 部署前检查清单

在部署到生产环境之前，请确认：

- [ ] ✅ 已创建 `.env.production` 文件或在平台配置了环境变量
- [ ] ✅ `OPENROUTER_API_KEY` 已正确配置
- [ ] ✅ `NEXT_PUBLIC_SITE_URL` 设置为生产域名（https://editwithwords.it.com）
- [ ] ✅ API Key 有效且账户有余额
- [ ] ✅ 服务器可以访问 OpenRouter API
- [ ] ✅ 已运行 `npm run build` 重新构建
- [ ] ✅ 防火墙允许出站 HTTPS 请求
- [ ] ✅ 已测试图片上传和生成功能
- [ ] ✅ 检查生产环境日志输出是否正常

---

## 🔍 如何查看生产环境日志？

### Vercel
```bash
vercel logs [deployment-url]
# 或在 Vercel Dashboard → Deployments → Logs
```

### Netlify
```bash
netlify logs
# 或在 Netlify Dashboard → Functions → Logs
```

### 自建服务器（PM2）
```bash
pm2 logs [app-name]
# 或
pm2 logs --lines 100
```

### Docker
```bash
docker logs [container-id]
# 实时查看
docker logs -f [container-id]
```

---

## 🔐 安全提示

1. **不要在代码中硬编码 API Key**
2. **不要将 `.env.production` 提交到 Git**
3. **定期轮换 API Key**
4. **使用环境变量管理敏感信息**
5. **生产环境日志不要输出完整的 API Key**

---

## 📞 紧急故障排查

如果以上步骤都无法解决问题，请：

1. **收集信息**：
   - 完整的错误日志
   - 环境变量配置（隐藏 API Key）
   - 服务器环境信息（Node.js 版本、操作系统等）
   
2. **对比本地环境**：
   - 在本地使用相同的环境变量测试
   - 确认本地和生产环境的差异

3. **临时解决方案**：
   - 使用本地环境作为临时替代
   - 检查 OpenRouter 服务状态

---

## 📊 监控建议

为避免未来出现类似问题，建议设置：

1. **日志监控**：实时监控 API 调用错误
2. **健康检查**：定期检查 API 连接状态
3. **告警通知**：API 失败时发送通知
4. **用量监控**：跟踪 API 调用次数和余额

---

## 更新记录

- 2025-10-05: 创建文档，添加详细的故障排查步骤和日志系统
- 优化了 API 路由的错误日志输出，便于生产环境排查问题
