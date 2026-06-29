/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 日式极简配色
        washi: '#F5F0EB',       // 暖白底色（和纸色）
        sumi: '#2C2C2C',        // 墨色（主文字）
        akane: '#BF4E3A',       // 茜色（朱红强调）
        akaneHover: '#A33D2B',  // 茜色深色（悬停）
        kin: '#B8A07A',         // 金色（辅助）
        nezumi: '#8B8682',      // 鼠色（次要文字）
        yuki: '#FAF8F5',        // 雪白（卡片底色）
        sumiLight: '#4A4A4A',   // 淡墨（边框等）
        sumiLighter: '#E5E0DA', // 极淡墨（分割线）
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Hiragino Sans"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};
