# 数据库设置指南

本文档介绍如何设置 Nano Banana 所需的数据库表。

## 📋 概述

为了支持 Creem 支付和订阅管理功能，我们需要在 Supabase 中创建以下表：

1. **subscriptions** - 存储用户订阅信息
2. **image_generations** - 记录图像生成历史（用于统计使用量）

## 🚀 设置步骤

### 1. 登录 Supabase

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 "SQL Editor"

### 2. 创建订阅表 (subscriptions)

在 SQL Editor 中执行以下 SQL 语句：

```sql
-- 创建订阅表
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, -- 订阅方案: 'free', 'pro', 'pro_yearly', 'enterprise'
  status TEXT NOT NULL DEFAULT 'inactive', -- 状态: 'active', 'cancelled', 'expired'
  subscription_id TEXT, -- Creem 订阅 ID
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- 每个用户只能有一个活跃订阅
);

-- 创建索引以提高查询性能
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_subscription_id ON public.subscriptions(subscription_id);

-- 启用 RLS (Row Level Security)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能查看自己的订阅
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- 创建 RLS 策略：用户可以插入自己的订阅（通过 Webhook）
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 添加注释
COMMENT ON TABLE public.subscriptions IS '用户订阅信息表';
COMMENT ON COLUMN public.subscriptions.plan IS '订阅方案';
COMMENT ON COLUMN public.subscriptions.status IS '订阅状态';
COMMENT ON COLUMN public.subscriptions.subscription_id IS 'Creem 订阅 ID';
```

### 3. 创建图像生成记录表 (image_generations)

```sql
-- 创建图像生成记录表
CREATE TABLE IF NOT EXISTS public.image_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_image_generations_user_id ON public.image_generations(user_id);
CREATE INDEX idx_image_generations_created_at ON public.image_generations(created_at);
CREATE INDEX idx_image_generations_status ON public.image_generations(status);

-- 启用 RLS
ALTER TABLE public.image_generations ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能查看自己的生成记录
CREATE POLICY "Users can view their own generations"
  ON public.image_generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS 策略：用户可以创建自己的生成记录
CREATE POLICY "Users can create their own generations"
  ON public.image_generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 添加注释
COMMENT ON TABLE public.image_generations IS '图像生成记录表，用于统计使用量';
```

### 4. 创建辅助函数（可选）

```sql
-- 创建函数：检查用户是否有足够的额度
CREATE OR REPLACE FUNCTION check_user_credits(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  credits_used INTEGER;
  credits_limit INTEGER;
BEGIN
  -- 获取用户订阅方案
  SELECT plan INTO user_plan
  FROM public.subscriptions
  WHERE user_id = user_uuid AND status = 'active'
  LIMIT 1;
  
  -- 如果没有订阅，使用免费方案
  IF user_plan IS NULL THEN
    user_plan := 'free';
  END IF;
  
  -- 设置额度限制
  CASE user_plan
    WHEN 'free' THEN credits_limit := 10;
    WHEN 'pro' THEN credits_limit := 500;
    WHEN 'pro_yearly' THEN credits_limit := 500;
    WHEN 'enterprise' THEN RETURN TRUE; -- 无限额度
    ELSE credits_limit := 10;
  END CASE;
  
  -- 统计本月使用量
  SELECT COUNT(*) INTO credits_used
  FROM public.image_generations
  WHERE user_id = user_uuid
    AND created_at >= DATE_TRUNC('month', NOW())
    AND status = 'completed';
  
  -- 检查是否还有额度
  RETURN credits_used < credits_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加注释
COMMENT ON FUNCTION check_user_credits IS '检查用户是否有足够的生成额度';
```

## 🔧 验证设置

执行以下 SQL 语句验证表是否创建成功：

```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('subscriptions', 'image_generations');

-- 查看 subscriptions 表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions';

-- 查看 RLS 策略
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('subscriptions', 'image_generations');
```

## 📝 测试数据（可选）

如果需要测试，可以插入一些示例数据：

```sql
-- 插入测试订阅（请替换 'your-user-id' 为实际的用户 ID）
INSERT INTO public.subscriptions (user_id, plan, status, current_period_start, current_period_end)
VALUES 
  ('your-user-id', 'pro', 'active', NOW(), NOW() + INTERVAL '30 days');

-- 查询订阅
SELECT * FROM public.subscriptions;
```

## ⚠️ 重要提示

1. **备份数据**: 在执行 SQL 语句前，确保备份现有数据
2. **Service Role Key**: Webhook 需要使用 Service Role Key 来绕过 RLS 策略
3. **RLS 策略**: 确保正确配置 RLS 策略以保护用户数据
4. **索引优化**: 根据实际查询模式调整索引

## 🔗 相关文档

- [Supabase 官方文档](https://supabase.com/docs)
- [RLS 策略指南](https://supabase.com/docs/guides/auth/row-level-security)
- [Creem 支付集成指南](./CREEM_SETUP.md)

## ❓ 常见问题

### Q: 如何删除所有测试数据？

```sql
-- 警告：这将删除所有数据！
TRUNCATE public.image_generations CASCADE;
TRUNCATE public.subscriptions CASCADE;
```

### Q: 如何重置用户的使用量？

```sql
-- 删除指定用户的本月生成记录
DELETE FROM public.image_generations
WHERE user_id = 'your-user-id'
  AND created_at >= DATE_TRUNC('month', NOW());
```

### Q: 如何手动激活用户的订阅？

```sql
-- 手动激活订阅
INSERT INTO public.subscriptions (user_id, plan, status, current_period_start, current_period_end)
VALUES (
  'your-user-id',
  'pro',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
)
ON CONFLICT (user_id) 
DO UPDATE SET 
  plan = EXCLUDED.plan,
  status = EXCLUDED.status,
  current_period_start = EXCLUDED.current_period_start,
  current_period_end = EXCLUDED.current_period_end,
  updated_at = NOW();
```

