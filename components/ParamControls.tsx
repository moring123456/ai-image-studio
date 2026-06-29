'use client';

import type { ModelId } from '@/lib/types';
import { MODELS } from '@/lib/types';

interface Props {
  model: ModelId;
  aspectRatio: string;
  onAspectRatioChange: (v: string) => void;
  imageSize: string;
  onImageSizeChange: (v: string) => void;
  quality: string;
  onQualityChange: (v: string) => void;
  format: string;
  onFormatChange: (v: string) => void;
  style: string;
  onStyleChange: (v: string) => void;
}

export default function ParamControls({
  model,
  aspectRatio, onAspectRatioChange,
  imageSize, onImageSizeChange,
  quality, onQualityChange,
  format, onFormatChange,
  style, onStyleChange,
}: Props) {
  const info = MODELS[model];
  const isGemini = model.startsWith('gemini');
  const isGPT = model === 'gpt-image-2';
  const isDalle = model === 'dall-e-3';

  return (
    <div className="space-y-4">
      {/* 宽高比 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-sumi">
          宽高比 {isDalle ? '(自动映射尺寸)' : ''}
        </label>
        <select
          value={aspectRatio}
          onChange={(e) => onAspectRatioChange(e.target.value)}
          className="w-full bg-white border border-sumiLighter rounded-lg px-3 py-2 text-sm text-sumi
            focus:outline-none focus:border-akane cursor-pointer"
        >
          {info.aspectRatios.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* 分辨率（Gemini / GPT） */}
      {(isGemini || isGPT) && info.imageSizes.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-sumi">分辨率</label>
          <select
            value={imageSize}
            onChange={(e) => onImageSizeChange(e.target.value)}
            className="w-full bg-white border border-sumiLighter rounded-lg px-3 py-2 text-sm text-sumi
              focus:outline-none focus:border-akane cursor-pointer"
          >
            {info.imageSizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* 画质（GPT Image-2） */}
      {isGPT && info.qualities && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-sumi">画质</label>
          <select
            value={quality}
            onChange={(e) => onQualityChange(e.target.value)}
            className="w-full bg-white border border-sumiLighter rounded-lg px-3 py-2 text-sm text-sumi
              focus:outline-none focus:border-akane cursor-pointer"
          >
            {info.qualities.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      )}

      {/* 输出格式（GPT Image-2） */}
      {isGPT && info.formats && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-sumi">输出格式</label>
          <select
            value={format}
            onChange={(e) => onFormatChange(e.target.value)}
            className="w-full bg-white border border-sumiLighter rounded-lg px-3 py-2 text-sm text-sumi
              focus:outline-none focus:border-akane cursor-pointer"
          >
            {info.formats.map((f) => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
        </div>
      )}

      {/* 风格（DALL·E 3） */}
      {isDalle && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-sumi">风格</label>
          <select
            value={style}
            onChange={(e) => onStyleChange(e.target.value)}
            className="w-full bg-white border border-sumiLighter rounded-lg px-3 py-2 text-sm text-sumi
              focus:outline-none focus:border-akane cursor-pointer"
          >
            <option value="vivid">Vivid · 鲜艳生动</option>
            <option value="natural">Natural · 自然写实</option>
          </select>
        </div>
      )}

      {/* HD（DALL·E 3） */}
      {isDalle && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-sumi">画质</label>
          <select
            value={quality}
            onChange={(e) => onQualityChange(e.target.value)}
            className="w-full bg-white border border-sumiLighter rounded-lg px-3 py-2 text-sm text-sumi
              focus:outline-none focus:border-akane cursor-pointer"
          >
            <option value="standard">标准</option>
            <option value="hd">HD · 高精细</option>
          </select>
        </div>
      )}
    </div>
  );
}
