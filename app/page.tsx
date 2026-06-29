'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GenerateRequest, HistoryItem, ModelId } from '@/lib/types';
import ControlPanel from '@/components/ControlPanel';
import ImagePreview from '@/components/ImagePreview';
import HistoryPanel from '@/components/HistoryPanel';

const HISTORY_KEY = 'ai-image-studio-history';
const MAX_HISTORY = 20;

function loadHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
}

export default function HomePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [usage, setUsage] = useState({ used: 0, limit: 30 });

  // 初始加载
  useEffect(() => {
    setHistory(loadHistory());
    fetchUsage();
  }, []);

  // Ctrl + Enter 快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        // 触发 ControlPanel 中的生成按钮
        // 简单做法：给按钮加 id，这里用 data 属性查找
        const btn = document.querySelector('[data-generate-btn]') as HTMLButtonElement;
        if (btn && !btn.disabled) btn.click();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  async function fetchUsage() {
    try {
      const resp = await fetch('/api/usage');
      const data = await resp.json();
      setUsage(data);
    } catch {
      // 静默处理
    }
  }

  const handleGenerate = useCallback(async (req: GenerateRequest) => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      const data = await resp.json();

      if (!resp.ok || !data.success) {
        setError(data.error || '生成失败');
        if (data.usage) setUsage(data.usage);
        return;
      }

      setImageUrl(data.imageUrl);
      if (data.usage) setUsage(data.usage);

      // 添加到历史记录
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        model: req.model,
        prompt: req.prompt,
        imageUrl: data.imageUrl,
        aspectRatio: req.aspectRatio,
      };
      const updated = [newItem, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      saveHistory(updated);
    } catch (err: any) {
      setError(err.message || '网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, [history]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setImageUrl(item.imageUrl);
    setError(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部状态栏 */}
      <header className="flex-shrink-0 px-6 py-3 border-b border-sumiLighter/50 bg-yuki/50 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <span className="text-sm font-medium text-sumi">AI 图像生成</span>
          </div>
          <div className="text-xs text-nezumi">
            Powered by yunwu.ai
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1400px] mx-auto flex gap-0">
          {/* 左侧控制面板 */}
          <aside className="w-[340px] flex-shrink-0 border-r border-sumiLighter/50 overflow-y-auto">
            <div className="p-5">
              <ControlPanel
                onGenerate={handleGenerate}
                isLoading={isLoading}
                onHistorySelect={handleHistorySelect}
                usage={usage}
              />
            </div>
          </aside>

          {/* 右侧预览 + 底部历史 */}
          <section className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* 预览区 */}
            <div className="flex-1 p-6 overflow-auto">
              <ImagePreview
                imageUrl={imageUrl}
                isLoading={isLoading}
                error={error}
              />
            </div>
            {/* 历史记录栏 */}
            <div className="flex-shrink-0 border-t border-sumiLighter/50 p-5">
              <HistoryPanel
                history={history}
                onSelect={handleHistorySelect}
                onClear={handleClearHistory}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
