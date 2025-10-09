# 🔍 紧急排查步骤

## 当前状态
- ✅ 命令行测试：API 返回 **500**（说明路由正常，只是缺配置）
- ❌ 浏览器测试：你说还是 **404**

## 🚨 这是缓存问题！

### 立即执行以下步骤：

## 步骤 1：完全重启开发服务器

```bash
# 1. 停止当前服务器（在终端按 Ctrl+C）
# 2. 清除 Next.js 缓存
rmdir /s /q .next

# 3. 重新启动
npm run dev
```

## 步骤 2：清除浏览器缓存

### Chrome/Edge：
1. 按 `Ctrl + Shift + Delete`
2. 选择"缓存的图像和文件"
3. 点击"清除数据"

### 或者使用硬刷新：
1. 打开页面：`http://localhost:3000/zh/pricing`
2. 按 `Ctrl + Shift + R`（硬刷新，绕过缓存）

## 步骤 3：使用隐私模式测试

1. 打开新的隐私/隐身窗口（`Ctrl + Shift + N`）
2. 访问：`http://localhost:3000/zh/pricing`
3. 点击"选择方案"
4. 查看控制台

## 步骤 4：验证修改是否生效

打开浏览器控制台，执行：

```javascript
fetch(`${window.location.origin}/api/creem/create-checkout`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({productId: 'test', billingCycle: 'monthly'})
}).then(r => r.json()).then(console.log)
```

**预期结果：**
- ❌ 不应该是 404
- ✅ 应该是 500 或其他错误（说明路由正常）

## 如果还是 404

检查文件是否真的保存了：

1. 打开 `components/pricing-section.tsx`
2. 找到第 135 行附近
3. 确认是否包含：
   ```typescript
   const apiUrl = `${window.location.origin}/api/creem/create-checkout`
   ```

## 快速验证命令

在项目根目录执行：
```bash
# 验证路由文件存在
dir app\api\creem\create-checkout\route.ts

# 验证修改的文件
findstr /n "window.location.origin" components\pricing-section.tsx
```

