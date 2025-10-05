import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getApiMessage, getLocaleFromRequest, getLocaleFromBody } from '@/lib/api-i18n';

// 初始化 OpenAI 客户端，连接到 OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Nano Banana AI Image Editor",
  },
});

export async function POST(request: NextRequest) {
  // 声明 locale 变量，以便在 catch 块中也能访问
  let locale: 'en' | 'zh' = 'en';
  
  try {
    // 解析请求数据
    const body = await request.json();
    const { imageUrl, prompt, locale: bodyLocale } = body;
    
    // 获取用户语言偏好
    locale = bodyLocale || getLocaleFromRequest(request);

    // 验证输入
    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: getApiMessage('missingInputs', locale) },
        { status: 400 }
      );
    }

    // 环境配置检查和日志输出（便于生产环境排查）
    const apiKey = process.env.OPENROUTER_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Nano Banana AI Image Editor";
    
    console.log('=== 图片生成请求开始 ===');
    console.log('时间:', new Date().toISOString());
    console.log('语言:', locale);
    console.log('提示词:', prompt);
    console.log('环境配置:');
    console.log('  - API Key 已配置:', !!apiKey);
    console.log('  - API Key 长度:', apiKey ? apiKey.length : 0);
    console.log('  - Site URL:', siteUrl);
    console.log('  - Site Name:', siteName);
    
    if (!apiKey) {
      console.error('❌ 严重错误: OPENROUTER_API_KEY 未配置！');
      throw new Error('API Key not configured. Please set OPENROUTER_API_KEY in environment variables.');
    }

    // 调用 Gemini 2.5 Flash Image API
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    // 打印完整的响应用于调试
    console.log('API 完整响应:', JSON.stringify(completion, null, 2));

    // 检查响应结构
    if (!completion || !completion.choices || completion.choices.length === 0) {
      console.error('API 返回了意外的响应结构:', completion);
      throw new Error(getApiMessage('invalidResponse', locale));
    }

    // 获取生成的结果
    const result = completion.choices[0].message;
    console.log('生成成功:', result);

    // 处理返回结果：可能是文本内容或图片
    let resultContent = result.content || '';
    let resultImage = null;

    // 方式1: 检查 message.images 数组
    // 使用类型断言，因为 OpenRouter 的响应可能包含额外的字段
    const resultWithImages = result as any;
    if (resultWithImages.images && Array.isArray(resultWithImages.images) && resultWithImages.images.length > 0) {
      const imageData = resultWithImages.images[0];
      if (imageData.image_url && imageData.image_url.url) {
        resultImage = imageData.image_url.url;
        console.log('检测到图片返回 (方式1):', resultImage);
      }
    }

    // 方式2: 检查 content 是否是数组且包含图片
    if (!resultImage && Array.isArray(result.content)) {
      for (const item of result.content) {
        if (item.type === 'image_url' && item.image_url) {
          resultImage = item.image_url.url || item.image_url;
          console.log('检测到图片返回 (方式2):', resultImage);
          break;
        }
        if (item.type === 'text' && item.text) {
          resultContent = item.text;
        }
      }
    }

    // 方式3: 检查顶层是否有 image 或 images 字段
    if (!resultImage && (completion as any).image) {
      resultImage = (completion as any).image;
      console.log('检测到图片返回 (方式3):', resultImage);
    }

    // 如果 content 为空但有图片，设置提示信息
    if (!resultContent && resultImage) {
      resultContent = getApiMessage('imageGenerated', locale);
    }

    // 如果都为空，给出错误提示
    if (!resultContent && !resultImage) {
      resultContent = getApiMessage('noContent', locale);
    }

    // 返回结果
    return NextResponse.json({
      success: true,
      result: resultContent,
      imageUrl: resultImage,
      message: getApiMessage('success', locale),
      debug: {
        hasContent: !!resultContent,
        hasImage: !!resultImage,
      }
    });

  } catch (error: any) {
    console.error('=== API 调用错误 ===');
    console.error('时间:', new Date().toISOString());
    console.error('错误类型:', error.constructor.name);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    
    // 输出更多调试信息
    if (error.response) {
      console.error('API 响应状态:', error.response.status);
      console.error('API 响应数据:', error.response.data);
    }
    
    // 使用已经获取的 locale（如果获取失败，则使用默认值 'en'）
    return NextResponse.json(
      {
        error: getApiMessage('failed', locale),
        details: error.message || getApiMessage('unknownError', locale),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

