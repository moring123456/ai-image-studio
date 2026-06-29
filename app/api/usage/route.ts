// ============================================================
// GET /api/usage — 查询当前用量
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getUsage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const usage = getUsage(ip);
  return NextResponse.json(usage);
}
