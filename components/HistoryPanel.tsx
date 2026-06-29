'use client';

import type { HistoryItem } from '@/lib/types';
import { MODELS } from '@/lib/types';

interface Props {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onSelect, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-sumi">历史记录</h3>
        <button
          onClick={onClear}
          className="text-xs text-nezumi hover:text-akane transition-colors"
        >
          清空
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex-shrink-0 w-28 group"
            title={item.prompt}
          >
            <div className="w-28 h-28 rounded-lg overflow-hidden border border-sumiLighter
              group-hover:border-akane transition-colors bg-sumiLighter">
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-1.5">
              <p className="text-xs text-sumi truncate">{item.prompt}</p>
              <p className="text-xs text-nezumi mt-0.5">
                {MODELS[item.model]?.name || item.model}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
