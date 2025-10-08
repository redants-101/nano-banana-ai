# GitHub 登录快速配置指南

## 前置要求

- 一个 GitHub 账号
- 一个 Supabase 账号（免费）

## 快速配置步骤（5 分钟）

### 1️⃣ 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com/)
2. 点击 "Start your project"
3. 创建新项目，等待初始化完成（约 2 分钟）

### 2️⃣ 获取 Supabase 密钥

在 Supabase Dashboard：
1. 进入 **Project Settings** → **API**
2. 复制以下信息：
   - `Project URL` → 这是您的 `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → 这是您的 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3️⃣ 启用 GitHub Provider

在 Supabase Dashboard：
1. 进入 **Authentication** → **Providers**
2. 找到 **GitHub**，点击展开
3. 复制 **Callback URL** (格式: `https://xxxxx.supabase.co/auth/v1/callback`)
4. 暂时不要关闭这个页面

### 4️⃣ 创建 GitHub OAuth 应用

1. 访问 [GitHub Settings](https://github.com/settings/developers)
2. 点击 **OAuth Apps** → **New OAuth App**
3. 填写信息：
   - **Application name**: `Nano Banana AI` (或任意名称)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: 粘贴步骤 3 中复制的 Supabase Callback URL
4. 点击 **Register application**
5. 复制 **Client ID**
6. 点击 **Generate a new client secret**，复制 **Client Secret**

### 5️⃣ 在 Supabase 中配置 GitHub

回到 Supabase Dashboard 的 GitHub Provider 页面：
1. 勾选 **Enable GitHub**
2. 粘贴 GitHub **Client ID**
3. 粘贴 GitHub **Client Secret**
4. 点击 **Save**

### 6️⃣ 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7️⃣ 启动应用

```bash
npm run dev
```

访问 http://localhost:3000，点击右上角的"登录"按钮测试！

## 🎉 完成！

现在您可以使用 GitHub 账号登录了。

## 生产环境部署

部署到生产环境时：

1. **更新 GitHub OAuth 应用**：
   - 添加生产环境的 Homepage URL
   - 添加生产环境的 Callback URL

2. **在 Supabase 中配置 URL**：
   - Dashboard → Authentication → URL Configuration
   - 添加生产环境 URL 到 **Redirect URLs**

3. **更新环境变量**：
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

## 常见问题

### ❌ 登录后跳转失败

**原因**：Supabase 的 Redirect URLs 配置不正确

**解决**：
1. Supabase Dashboard → Authentication → URL Configuration
2. 确保 `http://localhost:3000` 在允许列表中

### ❌ GitHub 授权失败

**原因**：GitHub OAuth 应用的回调 URL 不正确

**解决**：
1. 检查 GitHub OAuth 应用的 Authorization callback URL
2. 必须与 Supabase 提供的 Callback URL 完全一致

### ❌ 环境变量不生效

**解决**：
1. 确保 `.env.local` 文件在项目根目录
2. 重启开发服务器（Ctrl+C 然后重新 `npm run dev`）
3. 清除浏览器缓存

## 需要更多帮助？

查看完整文档：[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

