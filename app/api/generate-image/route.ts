import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
  try {
    // 解析请求数据
    const { imageUrl, prompt } = await request.json();

    // 验证输入
    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: '缺少图片或提示词' },
        { status: 400 }
      );
    }

    console.log('开始处理图片生成请求...');
    console.log('提示词:', prompt);

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
      throw new Error('API 返回了无效的响应');
    }

    // 获取生成的结果
    const result = completion.choices[0].message;
    console.log('生成成功:', result);

    // 处理返回结果：可能是文本内容或图片
    let resultContent = result.content || '';
    let resultImage = null;

    // 方式1: 检查 message.images 数组
    if (result.images && Array.isArray(result.images) && result.images.length > 0) {
      const imageData = result.images[0];
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
      resultContent = '✨ AI 已生成新图片！请查看下方的生成结果。';
    }

    // 如果都为空，给出错误提示
    if (!resultContent && !resultImage) {
      resultContent = 'AI 返回了响应，但没有可显示的内容。请查看控制台了解详细信息。';
    }

    // 返回结果
    return NextResponse.json({
      success: true,
      result: resultContent,
      imageUrl: resultImage,
      message: '图片处理成功！',
      debug: {
        hasContent: !!resultContent,
        hasImage: !!resultImage,
      }
    });

  } catch (error: any) {
    console.error('API 调用错误:', error);
    
    return NextResponse.json(
      {
        error: '图片生成失败',
        details: error.message || '未知错误',
      },
      { status: 500 }
    );
  }
}

