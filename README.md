# 🍌 Nano Banana - AI 图像编辑器

一个基于 AI 的智能图像编辑器，通过自然语言理解来编辑图片。

## 🚀 如何运行项目

### 第一步：配置 API Key 和 Supabase

在项目根目录创建 `.env.local` 文件，添加以下内容：

```env
# OpenRouter API Key for Gemini 2.5 Flash Image
OPENROUTER_API_KEY=your-api-key-here

# Supabase Configuration (for GitHub Login)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 应用信息（可选）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nano Banana AI Image Editor
```

⚠️ **重要提示**：
- `.env.local` 文件包含敏感信息，不要提交到 Git 仓库！
- 请将 `your-api-key-here` 替换为您从 [OpenRouter](https://openrouter.ai/) 获取的真实 API Key
- API Key 格式通常为：`sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxx`

📖 **配置社交登录**：
- GitHub 登录：查看 [Supabase 配置指南](./docs/SUPABASE_SETUP.md)
- Google 登录：查看 [Google OAuth 设置指南](./docs/GOOGLE_OAUTH_SETUP.md)

### 第二步：安装依赖

#### 方法一：使用 npm（推荐）

```bash
# 1. 安装项目依赖
npm install

# 2. 启动开发服务器
npm run dev
```

#### 方法二：使用 pnpm（备选）

```bash
# 1. 安装项目依赖
pnpm install

# 2. 启动开发服务器
pnpm dev
```

### 第三步：打开浏览器

访问：http://localhost:3000

---

## 🌐 生产环境部署

如果您要将项目部署到生产环境（如服务器、Vercel、Netlify 等），请查看详细的部署指南：

📖 **[生产环境部署指南](./docs/PRODUCTION_DEPLOYMENT.md)**

### 快速配置生产环境

在生产环境中，必须配置以下环境变量：

```bash
# 必需：OpenRouter API Key（与您的真实 API Key）
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxx

# 必需：生产环境域名（不要使用 localhost！）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 可选：网站名称
NEXT_PUBLIC_SITE_NAME=Nano Banana AI Image Editor
```

⚠️ **常见错误**：
- ❌ 生产环境未配置 `OPENROUTER_API_KEY`
- ❌ `NEXT_PUBLIC_SITE_URL` 仍然是 `http://localhost:3000`
- ❌ 修改环境变量后未重新构建项目

如遇到"图片生成失败"错误，请参考 [生产环境故障排查指南](./docs/PRODUCTION_DEPLOYMENT.md)

## 📋 系统要求

在运行项目之前，请确保您的电脑已经安装了：

1. **Node.js**（版本 18 或更高）
   - 检查是否安装：在命令行输入 `node -v`
   - 如果没有安装，请访问 [nodejs.org](https://nodejs.org) 下载安装

2. **pnpm**（可选但推荐）
   - 安装方法：在命令行输入 `npm install -g pnpm`

## 🛠️ 其他命令

```bash
# 构建生产版本
pnpm build

# 运行生产版本
pnpm start

# 检查代码规范
pnpm lint
```

## ✨ 核心功能

### 1. GitHub 登录 🔐
- 使用 GitHub 账号快速登录
- 安全的 OAuth 2.0 认证流程
- 自动保存用户登录状态
- 查看 [Supabase 配置指南](./docs/SUPABASE_SETUP.md) 了解如何配置

### 2. 多语言支持 🌐
- 支持中文和英文界面
- 点击右上角的语言按钮（🇺🇸 / 🇨🇳）切换语言
- 系统自动记住您的语言偏好
- 所有页面内容自动翻译

### 3. 图片上传
- 点击 "Add Image" 上传图片
- 支持 JPG、PNG、WebP 格式
- 最大文件大小：10MB

### 4. AI 图片处理
- 在 "Main Prompt" 输入框中输入您的提示词
- 描述您想要 AI 如何处理图片
- 点击 "Generate Now" 开始生成

### 5. 查看结果
- AI 处理结果会显示在 "Output Gallery" 区域
- 可以复制结果文本
- 可以重新生成

## 📁 项目结构

```
nano-banana-ai/
├── app/                    # 主要应用代码
│   ├── api/               # API 路由
│   │   └── generate-image/ # 图片生成 API
│   ├── page.tsx           # 主页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── editor-section.tsx # 编辑器核心功能
│   └── *-section.tsx     # 其他页面部分
├── public/               # 静态资源（图片等）
└── .env.local           # 环境变量（需手动创建）
```

## 🎨 技术栈

- **Next.js 14** - React 框架（使用 App Router）
- **TypeScript** - 类型安全的 JavaScript
- **Supabase** - 后端服务（认证、数据库）
- **next-intl** - 国际化（i18n）解决方案
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **OpenAI SDK** - API 调用库
- **Gemini 2.5 Flash Image** - Google 的 AI 图像处理模型
- **OpenRouter** - AI API 聚合平台

## ❓ 常见问题

### 如何创建 .env.local 文件？

**Windows 系统**：
1. 在项目根目录右键 → 新建 → 文本文档
2. 命名为 `.env.local`（注意前面有个点）
3. 打开文件，粘贴 API Key 配置
4. 保存文件

**提示**：如果 Windows 不允许创建以点开头的文件，可以使用命令行：
```bash
echo OPENROUTER_API_KEY=sk-or-v1-40f733fd4dc816e1cdb1706ef7fe6e639bdcc0ff17eab24 > .env.local
```

### API Key 无效怎么办？

1. 检查 `.env.local` 文件是否在项目根目录
2. 确认 API Key 复制正确，没有多余空格
3. 重启开发服务器（Ctrl+C 停止，然后重新运行 `npm run dev`）

### 上传图片后没有反应？

1. 确保图片小于 10MB
2. 检查图片格式是否支持（JPG、PNG、WebP）
3. 查看浏览器控制台是否有错误信息（按 F12 打开）

### 生成失败怎么办？

1. 检查网络连接是否正常
2. 确认 API Key 是否有效
3. 查看提示词是否输入正确
4. 检查浏览器控制台的错误信息

### 安装失败怎么办？

1. 确保 Node.js 版本是 18 或更高
2. 尝试清除缓存：`npm cache clean --force`
3. 删除 `node_modules` 文件夹，重新安装

### 端口 3000 被占用？

修改端口号运行：`npm run dev -- --port 3001`

### 页面显示不正常？

1. 确保所有依赖都安装成功
2. 清除浏览器缓存
3. 尝试使用 Chrome 或 Edge 浏览器

### 如何切换语言？

1. 点击页面右上角的语言按钮（🇺🇸 / 🇨🇳）
2. 在下拉菜单中选择想要的语言
3. 页面会自动切换到选择的语言
4. URL 会显示语言前缀（如 `/en` 或 `/zh`）

### 语言切换不工作？

1. 确保 URL 包含语言前缀（`/en` 或 `/zh`）
2. 清除浏览器缓存后重试
3. 检查浏览器控制台是否有错误（按 F12）
4. 重启开发服务器

## 📝 使用示例

### 示例提示词

1. **图片分析**：
   ```
   请详细描述这张图片的内容，包括主要元素、颜色、构图等
   ```

2. **图片编辑建议**：
   ```
   分析这张图片，给出改进建议，比如如何调整光线、构图或色彩
   ```

3. **内容识别**：
   ```
   识别这张图片中的所有物体和场景，并说明它们的位置关系
   ```

4. **创意描述**：
   ```
   用富有诗意的语言描述这张图片的氛围和情感
   ```

## 📞 需要帮助？

如果遇到任何问题，请检查：
1. 命令行是否在项目根目录下运行
2. 是否有报错信息（红色文字）
3. 网络连接是否正常（安装依赖和调用 API 都需要网络）
4. `.env.local` 文件是否创建正确
5. API Key 是否有效

## 🔐 安全提示

- ⚠️ **不要**将 `.env.local` 文件提交到 Git
- ⚠️ **不要**在公开场合分享您的 API Key
- ⚠️ 如果 API Key 泄露，请立即在 OpenRouter 平台更换

