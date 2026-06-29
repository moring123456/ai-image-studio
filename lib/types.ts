// ============================================================
// 类型定义
// ============================================================

/** 支持的模型 */
export type ModelId = 'gemini-2.5-flash-image' | 'gemini-2.5-flash-image-preview' | 'gemini-3-pro-image-preview' | 'gemini-3.1-flash-image-preview' | 'gpt-image-2' | 'dall-e-3';

/** 模型信息 */
export interface ModelInfo {
  id: ModelId;
  name: string;
  provider: string;
  supportsImageInput: boolean;
  /** 支持的宽高比列表 */
  aspectRatios: string[];
  /** 支持的图片尺寸（分辨率） */
  imageSizes: string[];
  /** 支持的画质 */
  qualities?: string[];
  /** 支持的输出格式 */
  formats?: string[];
}

/** 前端提交的生成请求 */
export interface GenerateRequest {
  model: ModelId;
  prompt: string;
  /** 图生图时的参考图片 base64 */
  referenceImage?: string;
  /** 宽高比 */
  aspectRatio?: string;
  /** 分辨率 */
  imageSize?: string;
  /** 画质 */
  quality?: string;
  /** 输出格式 */
  format?: string;
  /** DALL·E 风格 */
  style?: 'vivid' | 'natural';
}

/** 生成结果 */
export interface GenerateResult {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
  usage?: {
    used: number;
    limit: number;
  };
}

/** 历史记录项 */
export interface HistoryItem {
  id: string;
  timestamp: number;
  model: ModelId;
  prompt: string;
  imageUrl: string;
  aspectRatio?: string;
  referenceImage?: string; // 缩略图
}

/** 模型配置表 */
export const MODELS: Record<ModelId, ModelInfo> = {
  'gemini-3.1-flash-image-preview': {
    id: 'gemini-3.1-flash-image-preview',
    name: 'Gemini 3.1 Flash',
    provider: 'Google',
    supportsImageInput: true,
    aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9', '1:4', '1:8', '4:1', '8:1'],
    imageSizes: ['1K', '2K', '4K', '0.5K'],
  },
  'gemini-3-pro-image-preview': {
    id: 'gemini-3-pro-image-preview',
    name: 'Gemini 3 Pro',
    provider: 'Google',
    supportsImageInput: true,
    aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
    imageSizes: ['1K', '2K', '4K'],
  },
  'gemini-2.5-flash-image': {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    supportsImageInput: true,
    aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
    imageSizes: ['1K'],
  },
  'gemini-2.5-flash-image-preview': {
    id: 'gemini-2.5-flash-image-preview',
    name: 'Gemini 2.5 Flash (预览)',
    provider: 'Google',
    supportsImageInput: true,
    aspectRatios: ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
    imageSizes: ['1K'],
  },
  'gpt-image-2': {
    id: 'gpt-image-2',
    name: 'GPT Image-2',
    provider: 'OpenAI',
    supportsImageInput: false,
    aspectRatios: ['1:1', '3:2', '2:3', '4:3', '16:9', '4K横版'],
    imageSizes: ['standard', '2K', '4K'],
    qualities: ['low', 'medium', 'high', 'auto'],
    formats: ['png', 'jpeg', 'webp'],
  },
  'dall-e-3': {
    id: 'dall-e-3',
    name: 'DALL·E 3',
    provider: 'OpenAI',
    supportsImageInput: false,
    aspectRatios: ['1:1', '16:9', '9:16'],
    imageSizes: ['标准', 'HD'],
  },
};

/** GPT Image-2 尺寸映射 */
export const GPT_IMAGE_SIZE_MAP: Record<string, string> = {
  '1:1': '1024x1024',
  '3:2': '1536x1024',
  '2:3': '1024x1536',
  '4:3': '2048x1536',
  '16:9': '2048x1152',
  '4K横版': '3840x2160',
};

/** DALL·E 3 尺寸映射 */
export const DALLE_SIZE_MAP: Record<string, string> = {
  '1:1': '1024x1024',
  '16:9': '1792x1024',
  '9:16': '1024x1792',
};

/** Gemini 分辨率映射到 imageSize 参数 */
export const GEMINI_SIZE_MAP: Record<string, string> = {
  '0.5K': '0.5K',
  '1K': '1K',
  '2K': '2K',
  '4K': '4K',
};
