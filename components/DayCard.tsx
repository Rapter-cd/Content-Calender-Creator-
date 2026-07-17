'use client';
import { CalendarDay, Platform } from '@/lib/types';
import { cn } from '@/lib/utils';

const platformEmoji: Record<Platform, string> = {
  instagram: '📸',
  twitter: '🐦',
  linkedin: '💼',
  tiktok: '🎵',
  youtube: '▶️',
};

const typeLabels: Record<string, string> = {
  educational: 'Edu',
  entertaining: 'Fun',
  promotional: 'Promo',
  'behind-the-scenes': 'BTS',
  ugc: 'UGC',
  'trend-based': 'Trend',
  testimonial: 'Testimonial',
  announcement: 'News',
};

interface DayCardProps {
  day: CalendarDay;
  onClick?: () => void;
}

export default function DayCard({ day, onClick }: DayCardProps) {
  if (day.is_rest_day) {
    return (
      <div className="aspect-square rounded-xl border border-white/5 bg-white/2 flex flex-col items-center justify-center p-2">
        <span className="text-xs font-semibold text-muted-foreground/40">{day.day}</span>
        <span className="text-xs text-muted-foreground/30 mt-1">Rest</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group aspect-square rounded-xl border p-3 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer flex flex-col justify-between overflow-hidden',
        `type-${day.content_type}`
      )}
    >
      {/* Top: Day number + badge */}
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold opacity-80">{day.day}</span>
        <span
          className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/10"
        >
          {typeLabels[day.content_type] || day.content_type}
        </span>
      </div>

      {/* Middle: Hook text */}
      <p className="text-xs leading-tight opacity-90 line-clamp-3 my-1">
        {day.hook}
      </p>

      {/* Bottom: Platform icons */}
      <div className="flex items-center gap-0.5">
        {day.all_platforms.slice(0, 3).map((p) => (
          <span key={p} className="text-[10px]" title={p}>{platformEmoji[p]}</span>
        ))}
        {day.all_platforms.length > 3 && (
          <span className="text-[9px] opacity-60">+{day.all_platforms.length - 3}</span>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-xl" />
    </button>
  );
}
