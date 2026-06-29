// ============================================================
// 用量追踪（IP 级别，每天 30 张限制）
// 使用内存缓存 + 本地 JSON 文件持久化
// ============================================================

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const USAGE_FILE = path.join(DATA_DIR, 'usage.json');
const DAILY_LIMIT = 30;

interface DailyUsage {
  [date: string]: {  // "2026-06-15"
    [ip: string]: number;
  };
}

// 内存缓存
let usageCache: DailyUsage | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadUsage(): DailyUsage {
  if (usageCache) return usageCache;
  ensureDataDir();
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const raw = fs.readFileSync(USAGE_FILE, 'utf-8');
      usageCache = JSON.parse(raw);
    } else {
      usageCache = {};
    }
  } catch {
    usageCache = {};
  }
  return usageCache!;
}

function saveUsage(data: DailyUsage) {
  ensureDataDir();
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** 获取当前 IP 的今日用量 */
export function getUsage(ip: string): { used: number; limit: number } {
  const data = loadUsage();
  const today = getToday();
  return {
    used: data[today]?.[ip] || 0,
    limit: DAILY_LIMIT,
  };
}

/** 检查是否可以生成（不实际消耗） */
export function canGenerate(ip: string): boolean {
  const { used, limit } = getUsage(ip);
  return used < limit;
}

/** 消耗一次用量，返回更新后的数据 */
export function incrementUsage(ip: string): { used: number; limit: number } {
  const data = loadUsage();
  const today = getToday();

  if (!data[today]) data[today] = {};
  if (!data[today][ip]) data[today][ip] = 0;

  data[today][ip] += 1;
  saveUsage(data);

  return {
    used: data[today][ip],
    limit: DAILY_LIMIT,
  };
}

/** 清理 7 天前的旧数据 */
export function cleanOldUsage() {
  const data = loadUsage();
  const now = new Date();
  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

  let changed = false;
  for (const date of Object.keys(data)) {
    if (date < cutoffStr) {
      delete data[date];
      changed = true;
    }
  }
  if (changed) saveUsage(data);
}
