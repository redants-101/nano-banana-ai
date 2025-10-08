# 退出功能故障排查指南

如果你登录后看不到退出功能，请按照以下步骤排查问题。

## 🔍 快速诊断步骤

### 1. 打开浏览器控制台（F12）

查看控制台中的日志信息：

```javascript
// 你应该看到类似这样的日志：
初始用户状态: {id: "...", email: "..."}
当前用户信息: {user: {...}, username: "...", provider: "..."}
```

如果看到 `初始用户状态: null`，说明用户没有正确登录。

### 2. 手动检查用户状态

在浏览器控制台中运行以下命令：

```javascript
// 检查 Supabase 用户状态
const { createClient } = await import('/lib/supabase/client')
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
console.log('当前用户:', user)

// 检查 Session
const { data: { session } } = await supabase.auth.getSession()
console.log('当前会话:', session)
```

### 3. 检查页面元素

登录成功后，你应该在页面右上角看到：

- **一个圆形的用户头像按钮**（现在有紫色圆环高亮）
- 如果没有头像，会显示用户名的前两个字母
- 鼠标悬停时会显示提示文字："点击查看菜单 (已登录: 用户名)"

### 4. 强制刷新页面

有时候需要刷新页面来更新状态：

- 按 `Ctrl + F5` (Windows) 或 `Cmd + Shift + R` (Mac) 强制刷新
- 或者在控制台运行：`window.location.reload(true)`

## 🐛 常见问题及解决方案

### 问题 1：用户头像按钮不显示

**症状**：登录后只显示"登录"按钮，没有头像

**可能原因**：
1. 用户状态没有正确更新
2. 组件没有重新渲染

**解决方案**：
```javascript
// 在控制台手动触发状态更新
window.location.href = window.location.href
```

### 问题 2：头像显示但点击无反应

**症状**：能看到用户头像，但点击后没有下拉菜单

**可能原因**：
1. DropdownMenu 组件问题
2. JavaScript 错误阻止了事件处理

**解决方案**：
1. 检查控制台是否有红色错误信息
2. 尝试多点击几次
3. 检查是否有其他元素遮挡

### 问题 3：下拉菜单出现但没有"退出登录"选项

**症状**：点击头像有菜单，但只显示用户信息

**可能原因**：
组件渲染问题

**解决方案**：
检查组件版本是否最新

## 🔧 高级诊断

### 检查网络请求

1. 打开 Network 标签页
2. 刷新页面
3. 查找 `/api/auth/user` 请求
4. 确认响应中有用户数据

### 检查本地存储

在 Application 标签页中检查：

1. **Local Storage**
   - 查找 `supabase.auth.token` 键
   - 应该包含用户的认证 token

2. **Cookies**
   - 查找以 `sb-` 开头的 cookies
   - 这些是 Supabase 的认证 cookies

### 手动测试退出功能

即使看不到退出按钮，你也可以手动测试退出功能：

```javascript
// 在控制台运行
fetch('/api/auth/logout', { method: 'POST' })
  .then(res => res.json())
  .then(data => {
    console.log('退出结果:', data)
    window.location.reload()
  })
```

## 📋 检查清单

请确认以下几点：

- [ ] 环境变量配置正确（`.env.local` 文件）
- [ ] Supabase 项目正在运行
- [ ] Google/GitHub OAuth 配置正确
- [ ] 浏览器允许 cookies 和 JavaScript
- [ ] 没有浏览器插件阻止功能（如广告拦截器）
- [ ] 页面完全加载完成

## 🚨 紧急修复

如果以上方法都不能解决问题，尝试以下紧急修复：

### 1. 清除所有认证数据

```javascript
// 在控制台运行
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
})
window.location.href = '/'
```

### 2. 重新登录

清除数据后，重新进行登录流程。

### 3. 检查 Supabase Dashboard

登录 [Supabase Dashboard](https://app.supabase.com) 检查：
- Authentication > Users 中是否有你的用户记录
- 用户的 `last_sign_in_at` 时间是否正确

## 💬 需要更多帮助？

如果问题仍然存在，请提供以下信息：

1. 浏览器控制台的完整日志
2. Network 标签页中 auth 相关请求的响应
3. 你使用的浏览器和版本
4. 登录方式（GitHub 还是 Google）

## 视觉指南

登录成功后，你应该看到的界面元素：

```
页面右上角：
[语言切换器] [用户头像(圆形，带紫色环)] [开始使用按钮]
                    ↑
                点击这里打开菜单
                    ↓
              ┌──────────────┐
              │ 用户名       │
              │ 邮箱地址     │
              │──────────────│
              │ 🚪 退出登录  │ ← 点击这里退出
              └──────────────┘
```

---

希望这个指南能帮助你解决问题！
