'use client';

import type { ModelId } from '@/lib/types';
import { MODELS } from '@/lib/types';

interface Props {
  value: ModelId;
  onChange: (model: ModelId) => void;
}

export default function ModelSelector({ value, onChange }: Props) {
  const model = MODELS[value];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-sumi">模型选择</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as ModelId)}
          className="w-full appearance-none bg-white border border-sumiLighter rounded-lg px-4 py-2.5 pr-10 text-sm text-sumi
            focus:outline-none focus:border-akane focus:ring-1 focus:ring-akane/20
            cursor-pointer transition-colors"
        >
          {Object.entries(MODELS).map(([id, info]) => (
            <option key={id} value={id}>
              {info.name} — {info.provider}
            </option>
          ))}
        </select>
        {/* 自定义下拉箭头 */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
            <path d="M1 1L6 6L11 1" stroke="#8B8682" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {/* 模型能力标签 */}
      <div className="flex gap-1.5">
        {model.supportsImageInput && (
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-akane/10 text-akane">
            支持图生图
          </span>
        )}
        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-sumiLighter text-nezumi">
          {model.provider}
        </span>
      </div>
    </div>
  );
}
