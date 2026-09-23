'use client';
import { TrendItem } from '@/lib/types';
import { TrendingUp } from 'lucide-react';

const typeColors: Record<string, string> = {
  educational: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  entertaining: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  promotional: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'behind-the-scenes': 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  ugc: 'bg-green-500/10 text-green-300 border-green-500/20',
  'trend-based': 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  testimonial: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  announcement: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
};

interface TrendsBadgesProps {
  trends: TrendItem[];
}

export default function TrendsBadges({ trends }: TrendsBadgesProps) {
  if (!trends?.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-medium text-muted-foreground">
          {trends?.length || 0} Researched Trends
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all hover:scale-105 cursor-default ${
              typeColors[trend.content_type] || 'bg-white/5 text-foreground border-white/10'
            }`}
            title={trend.why_trending}
          >
            <span>#{trend.id}</span>
            <span>{trend.topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
