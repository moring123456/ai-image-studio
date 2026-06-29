import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 图像生成',
  description: '基于云端 AI 的文字/图片到图像生成工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-washi text-sumi">
        {children}
      </body>
    </html>
  );
}
