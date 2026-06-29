'use client';

interface Props {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function ImagePreview({ imageUrl, isLoading, error }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-yuki rounded-xl border border-sumiLighter overflow-hidden">
      {isLoading ? (
        /* 加载状态 */
        <div className="flex flex-col items-center gap-3 text-nezumi">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-sumiLighter rounded-full" />
            <div className="absolute inset-0 border-2 border-akane rounded-full border-t-transparent animate-spin" />
          </div>
          <span className="text-sm">生成中...</span>
        </div>
      ) : error ? (
        /* 错误状态 */
        <div className="flex flex-col items-center gap-2 text-red-500 max-w-xs text-center px-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      ) : imageUrl ? (
        /* 图片展示 */
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt="生成的图片"
            className="max-w-full max-h-[500px] rounded-lg shadow-sm object-contain"
          />
          <a
            href={imageUrl}
            download
            className="absolute bottom-6 right-6 inline-flex items-center gap-1.5 px-3 py-2 bg-white/90
              backdrop-blur-sm rounded-lg text-sm text-sumi border border-sumiLighter
              hover:bg-akane hover:text-white hover:border-akane transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            下载
          </a>
        </div>
      ) : (
        /* 空状态 */
        <div className="flex flex-col items-center gap-2 text-nezumi">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span className="text-sm">输入提示词，点击生成按钮</span>
        </div>
      )}
    </div>
  );
}
