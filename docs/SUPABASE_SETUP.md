# Supabase GitHub 登录配置指南

本项目使用 Supabase 实现 GitHub OAuth 登录功能，采用服务器端认证方式。

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 创建一个新项目
3. 等待项目初始化完成

## 2. 配置 GitHub OAuth 应用

### 2.1 创建 GitHub OAuth 应用

1. 访问 GitHub Settings > Developer settings > OAuth Apps
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: Nano Banana AI (或您的应用名称)
   - **Homepage URL**: `http://localhost:3000` (开发环境) 或您的生产环境 URL
   - **Authorization callback URL**: 从 Supabase Dashboard 获取
     - 进入 Supabase Project > Authentication > Providers > GitHub
     - 复制 "Callback URL (for OAuth)" 
     - 格式通常为: `https://<your-project-ref>.supabase.co/auth/v1/callback`

4. 创建应用后，保存 **Client ID** 和生成的 **Client Secret**

### 2.2 在 Supabase 中配置 GitHub Provider

1. 进入 Supabase Dashboard > Authentication > Providers
2. 找到 GitHub，点击启用
3. 填入您的 GitHub OAuth 应用的：
   - **Client ID**
   - **Client Secret**
4. 点击保存

## 3. 配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在），添加以下环境变量：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# 可选：配置站点 URL（用于 OAuth 回调）
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenAI Configuration (existing)
OPENAI_API_KEY=your-openai-api-key
```

### 获取 Supabase 密钥

1. 进入 Supabase Dashboard > Project Settings > API
2. 复制以下信息：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. 安装依赖

项目已经包含必要的依赖，如果需要重新安装：

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 5. 项目文件结构

```
lib/
├── supabase/
│   ├── server.ts      # 服务器端 Supabase 客户端
│   └── client.ts      # 浏览器端 Supabase 客户端

app/
├── api/
│   └── auth/
│       ├── login/      # 登录 API 路由
│       ├── callback/   # OAuth 回调路由
│       ├── logout/     # 登出 API 路由
│       └── user/       # 获取用户信息路由

components/
└── user-auth.tsx      # 用户认证 UI 组件

middleware.ts          # Next.js 中间件（处理会话刷新）
```

## 6. 使用方式

### 在组件中使用

用户认证组件已经集成到 Header 中，无需额外配置。

### 获取当前用户（服务器端）

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>User: {user?.email}</div>
}
```

### 获取当前用户（客户端）

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Component() {
  const [user, setUser] = useState(null)
  const supabase = createClient()
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])
  
  return <div>User: {user?.email}</div>
}
```

## 7. 测试

1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:3000`
3. 点击 Header 中的"登录"按钮
4. 应该会跳转到 GitHub 授权页面
5. 授权后会返回到您的应用，并显示用户头像

## 8. 生产环境配置

在部署到生产环境时：

1. 在 GitHub OAuth 应用中添加生产环境的回调 URL
2. 在 Supabase 中更新允许的重定向 URL：
   - Dashboard > Authentication > URL Configuration
   - 添加您的生产环境 URL
3. 更新环境变量 `NEXT_PUBLIC_SITE_URL` 为生产环境 URL

## 9. 安全建议

- ✅ 使用服务器端认证（已实现）
- ✅ 使用 middleware 自动刷新会话（已实现）
- ✅ 不要在客户端暴露 service_role key
- ✅ 定期轮换 GitHub OAuth Client Secret
- ✅ 在生产环境中设置正确的 CORS 和重定向 URL

## 10. 常见问题

### Q: 登录后重定向失败？
A: 检查 Supabase Dashboard 中的 URL Configuration，确保您的应用 URL 在允许列表中。

### Q: 获取不到用户信息？
A: 确保 middleware 正在运行，检查浏览器 Cookies 中是否有 Supabase 的认证 token。

### Q: GitHub OAuth 授权失败？
A: 检查 GitHub OAuth 应用的回调 URL 是否与 Supabase 提供的一致。

## 参考文档

- [Supabase Auth with GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Supabase Server-Side Auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side/nextjs)

