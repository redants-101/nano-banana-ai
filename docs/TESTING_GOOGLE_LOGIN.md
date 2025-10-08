# 测试 Google OAuth 登录功能

本文档将指导你如何测试新添加的 Google OAuth 登录功能。

## 测试前准备

### 1. 确认 Supabase 配置

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 进入 **Authentication** > **Providers**
3. 确认 **Google** provider 已启用并配置了正确的 Client ID 和 Client Secret

### 2. 确认环境变量

确保 `.env.local` 文件包含必要的环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 确认 Google Cloud Console 配置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 检查 OAuth 2.0 客户端 ID 的重定向 URI 是否包含：
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

## 测试步骤

### 步骤 1：启动开发服务器

```bash
npm run dev
```

### 步骤 2：访问应用

打开浏览器，访问 `http://localhost:3000`

### 步骤 3：测试登录流程

1. **点击登录按钮**
   - 页面右上角应该有一个 "登录" 按钮
   - 点击后应该弹出登录选项对话框

2. **选择 Google 登录**
   - 对话框中应该显示两个选项：
     - 使用 Google 账号登录
     - 使用 GitHub 账号登录
   - 点击 "使用 Google 账号登录"

3. **Google 授权页面**
   - 应该重定向到 Google 的登录页面
   - 如果已登录 Google，会显示授权页面
   - 如果未登录，需要先登录 Google 账号

4. **授权应用**
   - 查看请求的权限（应该包括 email 和 profile）
   - 点击 "允许" 或 "Continue"

5. **返回应用**
   - 授权成功后，应该自动重定向回应用
   - 页面右上角的登录按钮应该变成用户头像
   - 点击头像应该显示用户信息下拉菜单

### 步骤 4：验证用户信息

1. **检查用户头像**
   - 应该显示 Google 账号的头像
   - 如果没有头像，应该显示用户名首字母

2. **检查用户名**
   - 下拉菜单应该显示 Google 账号的全名
   - 应该显示 Google 邮箱地址

### 步骤 5：测试退出登录

1. 点击用户头像打开下拉菜单
2. 点击 "退出登录"
3. 应该返回到未登录状态
4. 登录按钮应该重新出现

## 测试检查清单

- [ ] 点击登录按钮能打开登录选项对话框
- [ ] Google 登录选项图标正确显示
- [ ] 点击 Google 登录能跳转到 Google 授权页面
- [ ] 授权后能正确返回应用
- [ ] 用户信息（头像、名称、邮箱）正确显示
- [ ] 退出登录功能正常工作
- [ ] GitHub 登录功能仍然正常（确保没有破坏原有功能）

## 常见问题排查

### 1. 点击 Google 登录没有反应

**可能原因**：
- API 路由没有正确更新
- 前端组件没有正确传递 provider 参数

**解决方法**：
- 检查浏览器控制台是否有错误信息
- 检查网络请求是否发送到 `/api/auth/login`
- 确认请求体包含 `provider: "google"`

### 2. Google 授权页面显示错误

**错误信息**：`Error 400: redirect_uri_mismatch`

**解决方法**：
- 确认 Google Cloud Console 中的重定向 URI 配置正确
- URI 格式应该是：`https://<your-project-ref>.supabase.co/auth/v1/callback`
- 注意不要有多余的斜杠或空格

### 3. 授权后返回应用但仍未登录

**可能原因**：
- Supabase 配置问题
- 回调处理问题

**解决方法**：
- 检查 Supabase Dashboard 中的 Google provider 配置
- 检查 `/api/auth/callback` 路由是否正确处理回调
- 查看浏览器控制台和网络请求的错误信息

### 4. 用户信息显示不正确

**可能原因**：
- Google 返回的用户元数据结构不同
- 前端组件没有正确读取 Google 用户信息

**解决方法**：
- 在浏览器控制台打印 `user.user_metadata` 查看数据结构
- 确认组件正确读取 `full_name` 和 `picture` 字段

## 调试技巧

### 1. 启用 Supabase 调试日志

在浏览器控制台运行：
```javascript
localStorage.setItem('supabase.auth.debug', 'true')
```

### 2. 检查网络请求

使用浏览器开发者工具的网络标签页，查看：
- `/api/auth/login` 请求和响应
- Google OAuth 重定向
- `/api/auth/callback` 回调请求

### 3. 检查用户会话

在浏览器控制台运行：
```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
console.log('User metadata:', session?.user?.user_metadata)
```

## 生产环境注意事项

1. **更新重定向 URI**
   - 在 Google Cloud Console 添加生产环境的重定向 URI
   - 更新 `NEXT_PUBLIC_SITE_URL` 为生产环境域名

2. **OAuth 同意屏幕**
   - 生产环境需要通过 Google 的验证
   - 确保填写完整的隐私政策和服务条款链接

3. **安全性**
   - 使用 HTTPS
   - 定期更新 Client Secret
   - 监控异常登录活动

## 相关文档

- [Google OAuth 设置指南](./GOOGLE_OAUTH_SETUP.md)
- [Supabase 配置指南](./SUPABASE_SETUP.md)
- [项目快速启动指南](./QUICKSTART.md)
