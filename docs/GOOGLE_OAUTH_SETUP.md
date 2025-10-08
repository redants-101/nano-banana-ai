# Google OAuth Setup Guide for Supabase

本指南将帮助你配置 Supabase 的 Google OAuth 登录功能。

## 前提条件

1. 已有 Supabase 项目
2. 已有 Google Cloud Platform 账号

## 步骤 1：配置 Google Cloud Console

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 在左侧菜单中，选择 **APIs & Services** > **Credentials**

## 步骤 2：创建 OAuth 2.0 客户端 ID

1. 点击 **Create Credentials** > **OAuth client ID**
2. 如果提示，先配置 OAuth consent screen：
   - 选择 **External** 用户类型
   - 填写应用信息（应用名称、用户支持邮箱等）
   - 在 Scopes 步骤中，添加以下 scopes：
     - `email`
     - `profile`
     - `openid`
   - 添加测试用户（如果在开发阶段）

3. 创建 OAuth client ID：
   - **Application type**: Web application
   - **Name**: 你的应用名称
   - **Authorized redirect URIs**: 添加以下 URI
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     你可以在 Supabase Dashboard 的 Settings > API 中找到你的项目 URL

4. 创建后，保存 **Client ID** 和 **Client Secret**

## 步骤 3：在 Supabase 中配置 Google Provider

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择你的项目
3. 导航到 **Authentication** > **Providers**
4. 找到 **Google** provider
5. 启用 Google provider
6. 填入从 Google Cloud Console 获取的：
   - **Client ID**
   - **Client Secret**
7. 保存设置

## 步骤 4：配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在）：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Site URL (for OAuth callback)
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Production (替换为你的域名)
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 步骤 5：测试登录流程

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问 `http://localhost:3000`

3. 点击登录按钮，选择 "使用 Google 账号登录"

4. 应该会重定向到 Google 登录页面

5. 授权后会自动返回应用

## 常见问题

### 1. 重定向 URI 不匹配错误

确保在 Google Cloud Console 中配置的重定向 URI 与 Supabase 项目的 URL 完全匹配。

### 2. 400 错误：redirect_uri_mismatch

检查以下几点：
- Google Cloud Console 中的重定向 URI 是否正确
- 确保使用 HTTPS（生产环境）
- URI 末尾不要有多余的斜杠

### 3. 用户信息获取问题

确保在 Google OAuth consent screen 配置中包含了必要的 scopes（email, profile）。

## 生产环境部署

1. 更新 Google Cloud Console 中的授权重定向 URI，添加生产环境 URL
2. 更新环境变量 `NEXT_PUBLIC_SITE_URL` 为生产环境域名
3. 确保 Supabase 项目的安全设置正确配置

## 安全建议

1. **不要** 在代码中硬编码任何密钥
2. **确保** `.env.local` 文件在 `.gitignore` 中
3. **使用** 环境变量管理服务（如 Vercel、Netlify 等）管理生产环境密钥
4. **定期** 轮换 Client Secret
5. **限制** OAuth 应用的权限范围到最小必要

## 相关链接

- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Server-side Auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
