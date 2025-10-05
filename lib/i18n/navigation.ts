import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '@/i18n';
import { defineRouting } from 'next-intl/routing';

// 定义路由配置
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

// 创建支持国际化的导航钩子
// 这些钩子会自动处理语言切换和路由
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

