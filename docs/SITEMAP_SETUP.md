# Sitemap 配置说明

## 概述

本项目已配置动态生成的 sitemap，可以自动为所有支持的语言生成站点地图。

## 功能特点

✅ **多语言支持** - 自动为所有语言（en, zh）生成 URL  
✅ **动态生成** - 无需手动维护，自动包含所有页面  
✅ **SEO 优化** - 包含优先级、更新频率和多语言替代链接  
✅ **易于扩展** - 添加新页面只需在配置中添加路径  

## 配置步骤

### 1. 设置环境变量

在您的 `.env.local` 文件中添加：

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

⚠️ **重要**：将 `your-domain.com` 替换为您的实际域名

### 2. 验证 Sitemap

启动开发服务器后，访问：

```
http://localhost:3000/sitemap.xml
```

您应该看到类似这样的 XML 输出：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2025-10-12T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/zh</loc>
    <lastmod>2025-10-12T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- 更多页面... -->
</urlset>
```

## 当前包含的页面

| 页面 | 优先级 | 更新频率 | 说明 |
|------|--------|----------|------|
| 首页 `/` | 1.0 | daily | 最高优先级 |
| 定价 `/pricing` | 0.9 | weekly | 重要页面 |
| 支付成功 `/payment/success` | 0.5 | monthly | 功能页面 |
| 支付取消 `/payment/cancel` | 0.5 | monthly | 功能页面 |

## 添加新页面

编辑 `app/sitemap.ts` 文件，在 `routes` 数组中添加新路径：

```typescript
const routes = [
  // ... 现有路径
  {
    path: '/new-page',
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  },
]
```

### 优先级建议

- `1.0` - 首页
- `0.8-0.9` - 主要页面（定价、功能、关于等）
- `0.5-0.7` - 次要页面（博客文章、文档等）
- `0.3-0.4` - 低优先级页面（条款、隐私政策等）

### 更新频率选项

- `always` - 每次访问都可能变化
- `hourly` - 每小时更新
- `daily` - 每天更新
- `weekly` - 每周更新
- `monthly` - 每月更新
- `yearly` - 每年更新
- `never` - 归档内容，不再变化

## 提交到搜索引擎

### Google Search Console

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 选择您的网站
3. 在左侧菜单选择 "Sitemaps"
4. 输入 `sitemap.xml` 并点击提交

### Bing Webmaster Tools

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 选择您的网站
3. 在 "Sitemaps" 部分添加 sitemap URL

## robots.txt 配置

建议在 `public/robots.txt` 中添加 sitemap 引用：

```txt
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

## 多语言说明

Sitemap 会为每个支持的语言生成 URL：

- 英文（默认）: `https://your-domain.com/`
- 中文: `https://your-domain.com/zh`

每个 URL 还包含 `alternates` 标签，告诉搜索引擎其他语言版本的位置。

## 故障排除

### Sitemap 不生成

- ✅ 确保已设置 `NEXT_PUBLIC_SITE_URL` 环境变量
- ✅ 重启开发服务器
- ✅ 清除 `.next` 缓存：`rm -rf .next` 或 `rd /s /q .next`（Windows）

### URL 格式不正确

- ✅ 检查 `NEXT_PUBLIC_SITE_URL` 不要以 `/` 结尾
- ✅ 确保包含协议（`https://`）

### 新页面未出现

- ✅ 确保在 `routes` 数组中添加了路径
- ✅ 重新构建项目：`npm run build`

## 技术细节

- **文件位置**: `app/sitemap.ts`
- **框架**: Next.js 14+ App Router
- **类型**: 动态生成（每次请求时生成）
- **格式**: XML（符合 sitemaps.org 标准）

## 相关资源

- [Next.js Sitemap 文档](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Sitemap 指南](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [Sitemaps.org 协议](https://www.sitemaps.org/protocol.html)

