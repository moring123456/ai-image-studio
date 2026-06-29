// ============================================================
// 用量追踪（IP 级别，每天 30 张限制）
// 使用内存存储，兼容 Vercel Serverless 环境
// 注意：重启后数据重置，生产环境建议升级为 Vercel KV
// ============================================================

const DAILY_LIMIT = 30;

// 内存中的用量数据: { [date]: { [ip]: count } }
const usageStore: Record<string, Record<string, number>> = {};

function getToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** 获取当前 IP 的今日用量 */
export function getUsage(ip: string): { used: number; limit: number } {
  const today = getToday();
  return {
    used: usageStore[today]?.[ip] || 0,
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
  const today = getToday();

  if (!usageStore[today]) usageStore[today] = {};
  if (!usageStore[today][ip]) usageStore[today][ip] = 0;

  usageStore[today][ip] += 1;

  return {
    used: usageStore[today][ip],
    limit: DAILY_LIMIT,
  };
}
