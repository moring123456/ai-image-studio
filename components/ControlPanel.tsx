'use client';

import { useState, useCallback } from 'react';
import type { ModelId, GenerateRequest, HistoryItem } from '@/lib/types';
import { MODELS } from '@/lib/types';
import ModelSelector from './ModelSelector';
import ImageUploader from './ImageUploader';
import ParamControls from './ParamControls';
import UsageIndicator from './UsageIndicator';

interface Props {
  onGenerate: (req: GenerateRequest) => Promise<void>;
  isLoading: boolean;
  onHistorySelect: (item: HistoryItem) => void;
  usage: { used: number; limit: number };
}

export default function ControlPanel({ onGenerate, isLoading, onHistorySelect, usage }: Props) {
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview');
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('2K');
  const [quality, setQuality] = useState('auto');
  const [format, setFormat] = useState('png');
  const [style, setStyle] = useState<'vivid' | 'natural'>('vivid');

  const handleModelChange = useCallback((m: ModelId) => {
    setModel(m);
    const info = MODELS[m];
    setAspectRatio(info.aspectRatios[0]);
    setImageSize(info.imageSizes?.[0] || '1K');
    if (info.qualities) setQuality(info.qualities[0]);
    if (info.formats) setFormat(info.formats[0]);
    if (m === 'gpt-image-2') setReferenceImage(null); // GPT 不支持图生图
  }, []);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim()) return;
    onGenerate({
      model,
      prompt: prompt.trim(),
      referenceImage: referenceImage || undefined,
      aspectRatio,
      imageSize,
      quality,
      format,
      style,
    });
  }, [model, prompt, referenceImage, aspectRatio, imageSize, quality, format, style, onGenerate]);

  const isAtLimit = usage.used >= usage.limit;

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* 标题 */}
      <div>
        <h1 className="text-lg font-bold text-sumi tracking-wide">
          AI 图像生成
        </h1>
        <p className="text-xs text-nezumi mt-0.5">选择模型，输入描述，一键生成</p>
      </div>

      {/* 用量 */}
      <UsageIndicator used={usage.used} limit={usage.limit} />

      {/* 模型选择 */}
      <ModelSelector value={model} onChange={handleModelChange} />

      {/* 提示词 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-sumi">提示词</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想要生成的画面..."
          rows={3}
          maxLength={1000}
          className="w-full bg-white border border-sumiLighter rounded-lg px-4 py-2.5 text-sm text-sumi
            placeholder:text-nezumi/50 resize-none
            focus:outline-none focus:border-akane focus:ring-1 focus:ring-akane/20
            transition-colors"
        />
        <p className="text-xs text-nezumi text-right">{prompt.length}/1000</p>
      </div>

      {/* 图片上传（仅 Gemini 支持） */}
      {MODELS[model].supportsImageInput && (
        <ImageUploader
          onImageSelect={(b64) => setReferenceImage(b64)}
          onClear={() => setReferenceImage(null)}
          imagePreview={referenceImage}
        />
      )}

      {/* 参数控制 */}
      <ParamControls
        model={model}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        imageSize={imageSize}
        onImageSizeChange={setImageSize}
        quality={quality}
        onQualityChange={setQuality}
        format={format}
        onFormatChange={setFormat}
        style={style}
        onStyleChange={(v) => setStyle(v as 'vivid' | 'natural')}
      />

      {/* 生成按钮 */}
      <button
        data-generate-btn
        onClick={handleSubmit}
        disabled={isLoading || !prompt.trim() || isAtLimit}
        className="w-full py-3 rounded-lg text-sm font-medium text-white
          bg-akane hover:bg-akaneHover
          disabled:bg-sumiLighter disabled:text-nezumi disabled:cursor-not-allowed
          transition-all duration-200 active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            生成中...
          </span>
        ) : isAtLimit ? (
          '今日额度已用完'
        ) : (
          '生成图片'
        )}
      </button>

      {/* 键盘提示 */}
      <p className="text-xs text-nezumi text-center">
        Ctrl + Enter 快速生成
      </p>
    </div>
  );
}
