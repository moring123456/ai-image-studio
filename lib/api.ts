// ============================================================
// API 代理层 — 与 yunwu.ai 通信
// ============================================================

import type { GenerateRequest, ModelId } from './types';
import {
  GPT_IMAGE_SIZE_MAP,
  DALLE_SIZE_MAP,
} from './types';

const YUNWU_BASE = 'https://yunwu.ai';
const API_KEY = process.env.YUNWU_API_KEY || '';

interface CallGeminiParams {
  model: ModelId;
  prompt: string;
  referenceImage?: string; // base64
  aspectRatio?: string;
  imageSize?: string;
}

interface CallOpenAIParams {
  model: string;
  prompt: string;
  size?: string;
  quality?: string;
  format?: string;
  style?: string;
}

/** 调用 Gemini 原生接口（文生图 + 图生图） */
async function callGemini(params: CallGeminiParams) {
  const { model, prompt, referenceImage, aspectRatio, imageSize } = params;

  const parts: any[] = [];
  if (referenceImage) {
    const [mimeType, data] = referenceImage.split(',');
    const mime = mimeType.replace('data:', '').replace(';base64', '');
    parts.push({
      inline_data: { mime_type: mime || 'image/png', data: data },
    });
  }
  parts.push({ text: prompt });

  const body: any = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['Image'],
      imageConfig: {} as Record<string, string>,
    },
  };

  if (aspectRatio) {
    body.generationConfig.imageConfig.aspectRatio = aspectRatio;
  }
  if (imageSize) {
    body.generationConfig.imageConfig.imageSize = imageSize;
  }

  const url = `${YUNWU_BASE}/v1beta/models/${model}:generateContent`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API 错误 (${resp.status}): ${errText}`);
  }

  const json = await resp.json();

  // Gemini 返回 base64 图片在 candidates[0].content.parts 中
  const partsResult = json?.candidates?.[0]?.content?.parts;
  if (!partsResult) {
    throw new Error('Gemini 未返回图片数据');
  }

  for (const part of partsResult) {
    if (part.inlineData?.data) {
      const mimeType = part.inlineData.mimeType || 'image/png';
      return { base64: part.inlineData.data, mimeType };
    }
  }

  throw new Error('Gemini 响应中未找到图片');
}

/** 调用 OpenAI 兼容接口（GPT Image-2 / DALL·E 3） */
async function callOpenAIImage(params: CallOpenAIParams) {
  const { model, prompt, size, quality, format, style } = params;

  const body: any = {
    model,
    prompt,
    n: 1,
  };

  if (size) body.size = size;
  if (quality) body.quality = quality;
  if (format && model === 'gpt-image-2') body.format = format;
  if (style && model === 'dall-e-3') body.style = style;

  const url = `${YUNWU_BASE}/v1/images/generations`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`OpenAI API 错误 (${resp.status}): ${errText}`);
  }

  const json = await resp.json();

  // 尝试标准 DALL·E 格式: data[0].url
  if (json?.data?.[0]?.url) {
    return { url: json.data[0].url };
  }

  // 尝试 GPT Image 格式: choices[0].message.content 中可能含 base64 或 URL
  if (json?.choices?.[0]?.message?.content) {
    const content = json.choices[0].message.content;
    // 判断是 URL 还是 base64
    if (content.startsWith('http')) {
      return { url: content };
    }
    return { base64: content.replace(/^data:image\/\w+;base64,/, ''), mimeType: 'image/png' };
  }

  throw new Error('OpenAI 响应中未找到图片');
}

/** 下载 URL 图片，转为 base64 */
async function downloadImageAsBase64(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`下载图片失败: ${resp.status}`);
  const buffer = await resp.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

/** 判断模型是否属于 Gemini 系列 */
function isGeminiModel(model: ModelId): boolean {
  return model.startsWith('gemini');
}

/** 主生成入口 */
export async function callGenerateAPI(req: GenerateRequest) {
  const { model, prompt, referenceImage, aspectRatio, imageSize, quality, format, style } = req;

  if (isGeminiModel(model)) {
    const result = await callGemini({
      model,
      prompt,
      referenceImage: referenceImage || undefined,
      aspectRatio,
      imageSize,
    });
    return result;
  }

  // OpenAI 兼容模型
  let size: string | undefined;
  if (model === 'gpt-image-2') {
    size = aspectRatio ? GPT_IMAGE_SIZE_MAP[aspectRatio] : '1024x1024';
  } else if (model === 'dall-e-3') {
    size = aspectRatio ? DALLE_SIZE_MAP[aspectRatio] : '1024x1024';
  }

  const result = await callOpenAIImage({
    model: model === 'gpt-image-2' ? 'gpt-image-2' : 'dall-e-3',
    prompt,
    size,
    quality: quality || undefined,
    format: format || undefined,
    style: style || undefined,
  });

  return result;
}
