/**
 * API 路由国际化辅助函数
 * API Route Internationalization Helper
 */

type Locale = 'en' | 'zh';

interface ApiMessages {
  [key: string]: {
    en: string;
    zh: string;
  };
}

// API 响应消息
const apiMessages: ApiMessages = {
  // 图片生成 API
  missingInputs: {
    en: 'Missing image or prompt',
    zh: '缺少图片或提示词'
  },
  imageGenerated: {
    en: '✨ AI has generated a new image! Please check the result below.',
    zh: '✨ AI 已生成新图片！请查看下方的生成结果。'
  },
  noContent: {
    en: 'AI returned a response, but there is no displayable content. Please check the console for details.',
    zh: 'AI 返回了响应，但没有可显示的内容。请查看控制台了解详细信息。'
  },
  success: {
    en: 'Image processed successfully!',
    zh: '图片处理成功！'
  },
  failed: {
    en: 'Image generation failed',
    zh: '图片生成失败'
  },
  unknownError: {
    en: 'Unknown error',
    zh: '未知错误'
  },
  invalidResponse: {
    en: 'API returned an invalid response',
    zh: 'API 返回了无效的响应'
  }
};

/**
 * 获取 API 消息的国际化文本
 * @param key 消息键
 * @param locale 语言代码（默认为 'en'）
 * @returns 对应语言的消息文本
 */
export function getApiMessage(key: keyof typeof apiMessages, locale: Locale = 'en'): string {
  const message = apiMessages[key];
  if (!message) {
    console.warn(`API message key "${key}" not found`);
    return String(key);
  }
  return message[locale] || message.en;
}

/**
 * 从请求中提取语言偏好
 * @param request Next.js Request 对象
 * @returns 语言代码
 */
export function getLocaleFromRequest(request: Request): Locale {
  try {
    // 1. 尝试从请求体中获取（如果有）
    // 2. 从 URL 路径中提取语言（例如 /en/api/... 或 /zh/api/...）
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    if (pathSegments[0] === 'en' || pathSegments[0] === 'zh') {
      return pathSegments[0] as Locale;
    }
    
    // 3. 从 Accept-Language 头部获取
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      if (acceptLanguage.includes('zh')) {
        return 'zh';
      }
    }
    
    // 4. 从 Referer 头部获取（如果是从页面调用的）
    const referer = request.headers.get('referer');
    if (referer) {
      if (referer.includes('/zh/') || referer.includes('/zh')) {
        return 'zh';
      }
      if (referer.includes('/en/') || referer.includes('/en')) {
        return 'en';
      }
    }
    
    // 默认返回英文
    return 'en';
  } catch (error) {
    console.error('Error getting locale from request:', error);
    return 'en';
  }
}

/**
 * 从请求体中提取语言偏好
 * @param body 请求体对象
 * @returns 语言代码
 */
export function getLocaleFromBody(body: any): Locale {
  if (body && (body.locale === 'en' || body.locale === 'zh')) {
    return body.locale;
  }
  return 'en';
}
