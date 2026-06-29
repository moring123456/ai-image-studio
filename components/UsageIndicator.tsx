'use client';

interface Props {
  used: number;
  limit: number;
}

export default function UsageIndicator({ used, limit }: Props) {
  const pct = Math.min((used / limit) * 100, 100);
  const isNearLimit = used >= limit * 0.8;
  const isAtLimit = used >= limit;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-sumiLighter rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isAtLimit ? 'bg-red-400' : isNearLimit ? 'bg-amber-400' : 'bg-akane'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-mono whitespace-nowrap ${
        isAtLimit ? 'text-red-500' : isNearLimit ? 'text-amber-600' : 'text-nezumi'
      }`}>
        {used}/{limit}
      </span>
    </div>
  );
}
