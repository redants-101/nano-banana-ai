# 贡献指南 Contributing Guide

感谢你对 Nano Banana AI 的兴趣！我们欢迎所有形式的贡献。

Thank you for your interest in Nano Banana AI! We welcome all forms of contributions.

## 🌟 如何贡献 How to Contribute

### 报告问题 Reporting Issues

如果你发现了 bug 或有功能建议：
1. 先搜索 [Issues](https://github.com/yourusername/nano-banana-ai/issues) 确保没有重复
2. 创建新的 Issue，提供详细信息
3. 使用清晰的标题和描述

If you find a bug or have a feature request:
1. Search [Issues](https://github.com/yourusername/nano-banana-ai/issues) to avoid duplicates
2. Create a new Issue with detailed information
3. Use a clear title and description

### 提交代码 Submitting Code

1. **Fork 项目 Fork the repository**
   ```bash
   git clone https://github.com/yourusername/nano-banana-ai.git
   cd nano-banana-ai
   ```

2. **创建分支 Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # 或 or
   git checkout -b fix/your-bug-fix
   ```

3. **安装依赖 Install dependencies**
   ```bash
   npm install
   ```

4. **配置环境变量 Setup environment**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 添加你的 API Key
   # Edit .env.local to add your API Key
   ```

5. **开发和测试 Develop and test**
   ```bash
   npm run dev
   npm run lint
   npm run type-check
   ```

6. **提交更改 Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # 或 or
   git commit -m "fix: resolve issue #123"
   ```

7. **推送并创建 PR Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   然后在 GitHub 上创建 Pull Request

## 📝 代码规范 Code Standards

### 提交信息格式 Commit Message Format

使用语义化提交信息 Use semantic commit messages:

- `feat:` 新功能 New feature
- `fix:` 修复 Bug Fix
- `docs:` 文档更新 Documentation
- `style:` 代码格式 Formatting
- `refactor:` 重构 Refactoring
- `test:` 测试 Tests
- `chore:` 构建/工具 Build/Tools

示例 Examples:
```
feat: add language switcher component
fix: resolve FAQ border display issue
docs: update README installation guide
```

### TypeScript

- 使用 TypeScript 编写代码
- 避免使用 `any`，尽量提供类型定义
- 运行 `npm run type-check` 确保没有类型错误

- Write code in TypeScript
- Avoid `any`, provide type definitions
- Run `npm run type-check` to ensure no type errors

### 代码风格 Code Style

- 遵循项目现有的代码风格
- 使用 ESLint 检查：`npm run lint`
- 组件使用函数式写法
- 添加适当的注释

- Follow existing code style
- Use ESLint: `npm run lint`
- Use functional components
- Add appropriate comments

### 组件规范 Component Standards

```typescript
// ✅ 好的做法 Good
'use client'  // 在文件顶部标明客户端组件

import { useState } from 'react'

/**
 * 组件说明
 * Component description
 */
export function MyComponent() {
  // ...
}

// ❌ 避免 Avoid
export default function MyComponent() {  // 使用命名导出 Use named exports
  // ...
}
```

## 🧪 测试 Testing

在提交 PR 前，请确保：
Before submitting a PR, ensure:

- [ ] 代码可以成功构建 Code builds successfully
  ```bash
  npm run build
  ```
- [ ] 没有 linting 错误 No linting errors
  ```bash
  npm run lint
  ```
- [ ] 没有 TypeScript 错误 No TypeScript errors
  ```bash
  npm run type-check
  ```
- [ ] 在浏览器中测试功能 Test functionality in browser
- [ ] 测试中英文切换 Test language switching

## 🌍 国际化 Internationalization

添加新功能时，记得更新翻译文件：
When adding new features, update translation files:

1. 在 `messages/en.json` 添加英文翻译
2. 在 `messages/zh.json` 添加中文翻译
3. 保持两个文件的结构一致

1. Add English translation in `messages/en.json`
2. Add Chinese translation in `messages/zh.json`
3. Keep both files' structure consistent

## 📚 文档 Documentation

- 更新 README.md（如果添加了新功能）
- 添加代码注释
- 更新相关的 docs/ 文件

- Update README.md (if adding new features)
- Add code comments
- Update relevant docs/ files

## 🤝 行为准则 Code of Conduct

- 尊重所有贡献者 Respect all contributors
- 提供建设性的反馈 Provide constructive feedback
- 保持友好和专业 Be friendly and professional

## ❓ 需要帮助？ Need Help?

- 查看 [README.md](./README.md)
- 阅读 [docs/](./docs/) 中的文档
- 在 Issues 中提问
- Check [README.md](./README.md)
- Read documentation in [docs/](./docs/)
- Ask questions in Issues

## 📄 许可 License

贡献的代码将使用与项目相同的 MIT 许可证。

Contributions will be licensed under the same MIT license as the project.

---

再次感谢你的贡献！🎉

Thank you again for your contribution! 🎉
