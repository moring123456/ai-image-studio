'use client';

import { useState, useRef, DragEvent } from 'react';

interface Props {
  onImageSelect: (base64: string) => void;
  onClear: () => void;
  imagePreview: string | null;
}

export default function ImageUploader({ onImageSelect, onClear, imagePreview }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.match(/image\/(png|jpeg|webp)/)) {
      alert('仅支持 PNG、JPEG、WebP 格式的图片');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-sumi">参考图片（图生图）</label>

      {imagePreview ? (
        <div className="relative rounded-lg overflow-hidden border border-sumiLighter">
          <img
            src={imagePreview}
            alt="参考图片"
            className="w-full h-32 object-cover"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white
              flex items-center justify-center text-xs hover:bg-black/60 transition-colors"
            title="移除图片"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-akane bg-akane/5'
              : 'border-sumiLighter hover:border-nezumi bg-white'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />
          <div className="text-nezumi text-sm">
            <svg className="w-6 h-6 mx-auto mb-1 text-nezumi" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            拖拽图片到此处，或<span className="text-akane">点击上传</span>
          </div>
        </div>
      )}
    </div>
  );
}
