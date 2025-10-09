# HTTP 405 错误详解

## 🔍 什么是 405 错误？

**405 Method Not Allowed** = HTTP 方法不允许

简单来说：你用错了"打开门"的方式。

## 🚪 通俗解释

想象一下门禁系统：

```
🚪 门禁卡（POST） ✅ → 门打开
🔑 钥匙（GET）   ❌ → 405：这个门不接受钥匙！
```

在我们的项目中：
```
POST /api/auth/login   ✅ 正确方式
GET  /api/auth/login   ❌ 405 错误
```

## 📊 HTTP 方法对比

| HTTP 方法 | 用途 | 示例 |
|----------|------|------|
| **GET** | 获取数据，读取 | 打开网页、查看图片 |
| **POST** | 提交数据，创建 | 登录、注册、支付 |
| **PUT** | 更新数据 | 修改个人资料 |
| **DELETE** | 删除数据 | 删除账号 |

## 🐛 我们项目的 405 错误

### 错误日志
```
GET /api/auth/login 405 in 454ms
```

### 问题代码

**❌ 错误写法**（`pricing-section.tsx`）：
```javascript
// 这会发送 GET 请求
window.location.href = '/api/auth/login'
```

**✅ 正确写法**（`user-auth.tsx`）：
```javascript
// 明确指定 POST 方法
const response = await fetch('/api/auth/login', {
  method: 'POST',  // ← 关键！
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    provider: 'github',
    redirectTo: '/'
  })
})
```

### API 路由定义

`app/api/auth/login/route.ts`：
```javascript
// 只定义了 POST 方法
export async function POST(request: Request) {
  // 处理登录逻辑
}

// 没有定义 GET 方法
// export async function GET(request: Request) { ... } ❌ 缺失
```

## 🔧 三种修复方案

### 方案 1：改变跳转目标（✅ 已采用）

**修改前**：
```javascript
if (planId === 'free') {
  window.location.href = '/api/auth/login'  // ❌ 405 错误
  return
}
```

**修改后**：
```javascript
if (planId === 'free') {
  window.location.href = '/'  // ✅ 跳转到首页
  return
}
```

**优点**：
- 最简单，无需修改 API
- 用户体验友好（回到首页，可以点击登录按钮）
- 不会产生错误

### 方案 2：使用 POST 请求

```javascript
if (planId === 'free') {
  // 调用 API 获取登录 URL
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'github',
      redirectTo: '/'
    })
  })
  
  const { url } = await response.json()
  window.location.href = url  // 跳转到 GitHub OAuth
  return
}
```

**优点**：
- 直接触发登录流程
- 用户少一步操作

**缺点**：
- 代码更复杂
- 需要处理异步和错误

### 方案 3：添加 GET 支持（不推荐）

在 `app/api/auth/login/route.ts` 添加：
```javascript
export async function GET(request: Request) {
  // 重定向到 GitHub OAuth
  const supabase = await createClient()
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`
    }
  })
  
  return NextResponse.redirect(data.url)
}
```

**缺点**：
- 违反 REST 规范（登录应该用 POST）
- 不够灵活（无法选择登录方式）

## 🎯 为什么 `window.location.href` 会发送 GET？

### 原理解释

```javascript
// 方式 1：直接跳转 = GET 请求
window.location.href = '/api/auth/login'

// 等同于在地址栏输入 URL 并回车
// 浏览器默认行为 = GET 请求
```

### 不同的跳转方式

```javascript
// 1. 直接跳转（GET）
window.location.href = '/some-url'       // GET
window.location.assign('/some-url')      // GET
<a href="/some-url">点击</a>             // GET

// 2. 表单提交（可以是 POST）
<form method="POST" action="/api/login"> // POST
  <button type="submit">登录</button>
</form>

// 3. AJAX 请求（可以指定方法）
fetch('/api/login', { method: 'POST' })  // POST
```

## 📚 常见的 HTTP 状态码

| 状态码 | 含义 | 说明 |
|-------|------|------|
| **200** | OK | 成功 |
| **201** | Created | 创建成功 |
| **400** | Bad Request | 请求参数错误 |
| **401** | Unauthorized | 未登录 |
| **403** | Forbidden | 无权限 |
| **404** | Not Found | 路由不存在 |
| **405** | Method Not Allowed | HTTP 方法不对 |
| **500** | Internal Server Error | 服务器错误 |

## 🧪 如何测试修复

### 测试步骤

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问定价页面**：
   ```
   http://localhost:3000/zh/pricing
   ```

3. **点击免费版的"选择方案"**：
   - ✅ 应该跳转到首页（`/`）
   - ❌ 不应该看到 405 错误

4. **检查控制台**：
   - 按 F12 打开开发者工具
   - 查看 Console 和 Network 标签
   - 应该没有错误

### 预期结果

**修复前**：
```
❌ GET /api/auth/login 405 in 454ms
❌ 页面显示错误或无响应
```

**修复后**：
```
✅ 跳转到首页
✅ 用户可以点击右上角的登录按钮
✅ 没有任何错误
```

## 💡 最佳实践

### 何时使用 GET vs POST

**使用 GET**：
- ✅ 读取数据（查看文章、图片）
- ✅ 可以被收藏、分享的链接
- ✅ 搜索查询

**使用 POST**：
- ✅ 提交表单（登录、注册）
- ✅ 创建数据（发帖、上传）
- ✅ 包含敏感信息（密码、支付）

### REST API 设计规范

```javascript
// ✅ 推荐
POST   /api/auth/login      // 登录
POST   /api/auth/logout     // 登出
GET    /api/users/:id       // 获取用户信息
PUT    /api/users/:id       // 更新用户信息
DELETE /api/users/:id       // 删除用户

// ❌ 不推荐
GET    /api/auth/login      // 登录不应该用 GET
POST   /api/users/get/:id   // 获取数据不应该用 POST
```

## 🔗 相关资源

- [MDN: HTTP 请求方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)
- [MDN: HTTP 状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## ❓ 常见问题

### Q: 为什么不在 API 中同时支持 GET 和 POST？

**A**: 
- 登录操作应该用 POST（REST 规范）
- GET 请求会在浏览器历史和服务器日志中留下敏感信息
- POST 更安全，数据在请求体中而不是 URL 中

### Q: 如果一定要用 GET 怎么办？

**A**: 可以创建一个专门的 GET 端点：
```javascript
// app/api/auth/login-redirect/route.ts
export async function GET() {
  // 重定向到 OAuth
}

// 然后跳转到这个端点
window.location.href = '/api/auth/login-redirect'
```

### Q: 为什么 user-auth.tsx 中的登录没问题？

**A**: 因为它使用了正确的方法：
```javascript
fetch('/api/auth/login', {
  method: 'POST',  // ← 明确指定 POST
})
```

## 🎉 总结

**405 错误的核心原因**：
> API 路由只支持 POST，但代码发送了 GET 请求

**解决方案**：
1. ✅ 改为跳转到首页（最简单）
2. 使用 fetch 发送 POST 请求
3. 为 API 添加 GET 支持（不推荐）

**关键教训**：
- 使用 `window.location.href` 跳转 = GET 请求
- 调用 API 时注意 HTTP 方法匹配
- 登录等操作应该使用 POST 而不是 GET

