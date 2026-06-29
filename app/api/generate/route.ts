// ============================================================
// POST /api/generate — 图片生成代理
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { canGenerate, incrementUsage, cleanOldUsage } from '@/lib/storage';
import { callGenerateAPI } from '@/lib/api';
import type { GenerateRequest } from '@/lib/types';

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'outputs');

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function getClientIP(request: NextRequest): string {
  // Vercel 环境下通过 x-forwarded-for 获取真实 IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  // 本地开发 fallback
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

function saveBase64Image(base64: string, mimeType: string): string {
  ensureOutputDir();
  const ext = mimeType.split('/')[1] || 'png';
  const filename = `${Date.now()}.${ext}`;
  const filepath = path.join(OUTPUT_DIR, filename);
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(filepath, buffer);
  return `/outputs/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // 清理旧数据
    cleanOldUsage();

    // 检查用量限制
    if (!canGenerate(ip)) {
      return NextResponse.json(
        { success: false, error: '今日生成次数已达上限（30张），请明天再来。' },
        { status: 429 }
      );
    }

    // 解析请求
    const body: GenerateRequest = await request.json();

    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '请输入提示词描述。' },
        { status: 400 }
      );
    }

    if (!body.model) {
      return NextResponse.json(
        { success: false, error: '请选择生成模型。' },
        { status: 400 }
      );
    }

    // 调用 yunwu.ai 接口
    const result = await callGenerateAPI(body);

    // 处理返回的图片
    let imageUrl: string;

    if ('url' in result && result.url) {
      // URL 类型：下载后存本地
      const base64 = await downloadUrlAsBase64(result.url);
      const mimeType = result.url.match(/\.(png|jpe?g|webp)/)?.[1] || 'png';
      imageUrl = saveBase64Image(base64, `image/${mimeType === 'jpg' ? 'jpeg' : mimeType}`);
    } else if ('base64' in result && result.base64) {
      // Base64 类型：直接存本地
      imageUrl = saveBase64Image(result.base64, result.mimeType || 'image/png');
    } else {
      throw new Error('未获取到有效图片');
    }

    // 消耗用量
    const usage = incrementUsage(ip);

    return NextResponse.json({
      success: true,
      imageUrl,
      usage,
    });
  } catch (error: any) {
    console.error('[generate] 错误:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || '生成失败，请稍后重试。' },
      { status: 500 }
    );
  }
}

/** 下载 URL 图片，转为 base64 */
async function downloadUrlAsBase64(url: string): Promise<string> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`下载图片失败: ${resp.status}`);
  const buffer = await resp.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}
