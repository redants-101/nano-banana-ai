# Sitemap 测试指南

## 快速测试

### 1. 设置环境变量

创建或编辑 `.env.local` 文件：

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问 Sitemap

打开浏览器访问：

```
http://localhost:3000/sitemap.xml
```

**预期结果**：看到 XML 格式的站点地图，包含所有页面的多语言版本

### 4. 访问 Robots.txt

```
http://localhost:3000/robots.txt
```

**预期结果**：看到 robots.txt 内容，包含 sitemap 链接

## 验证清单

- [ ] Sitemap 包含所有主要页面
- [ ] 每个页面都有英文和中文版本
- [ ] URL 格式正确（以完整域名开头）
- [ ] 每个 URL 都有 `lastModified`、`changeFrequency` 和 `priority`
- [ ] Robots.txt 指向正确的 sitemap URL
- [ ] 没有敏感页面（如 `/api/`）被索引

## 示例输出

### Sitemap.xml 示例

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3000/</loc>
    <lastmod>2025-10-12T12:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>http://localhost:3000/zh</loc>
    <lastmod>2025-10-12T12:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>http://localhost:3000/pricing</loc>
    <lastmod>2025-10-12T12:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>http://localhost:3000/zh/pricing</loc>
    <lastmod>2025-10-12T12:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- 更多页面... -->
</urlset>
```

### Robots.txt 示例

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /payment/cancel

Sitemap: http://localhost:3000/sitemap.xml
```

## 生产环境测试

部署到生产环境后：

1. 将 `.env.production` 中的 `NEXT_PUBLIC_SITE_URL` 设置为实际域名
2. 访问 `https://your-domain.com/sitemap.xml`
3. 验证所有 URL 都使用了正确的生产域名
4. 提交到搜索引擎

## 常见问题

### Q: Sitemap 显示 "your-domain.com"？

**A:** 您需要设置 `NEXT_PUBLIC_SITE_URL` 环境变量。

### Q: 修改后没有更新？

**A:** 
1. 重启开发服务器
2. 清除浏览器缓存
3. 删除 `.next` 文件夹后重新运行

### Q: 如何验证 SEO 效果？

**A:** 使用以下工具：
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## 性能检查

使用 Google 的 Rich Results Test：

```
https://search.google.com/test/rich-results?url=https://your-domain.com/sitemap.xml
```

## 下一步

✅ Sitemap 配置完成  
⬜ 提交到 Google Search Console  
⬜ 提交到 Bing Webmaster Tools  
⬜ 监控索引状态  
⬜ 定期更新页面优先级

