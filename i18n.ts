import { getRequestConfig } from 'next-intl/server';

// 定义支持的语言列表
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

// 这是 next-intl 的核心配置，必须作为默认导出
export default getRequestConfig(async ({ locale }) => {
  // 确保 locale 是有效的字符串
  const validLocale = locale || defaultLocale;
  
  // 动态加载对应语言的翻译文件
  return {
    locale: validLocale,  // 必须返回 locale，这是 next-intl 的要求
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});