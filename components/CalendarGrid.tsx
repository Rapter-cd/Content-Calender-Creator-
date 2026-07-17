'use client';
import { useState } from 'react';
import { CalendarDay } from '@/lib/types';
import DayCard from './DayCard';
import { Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  onDayClick: (day: CalendarDay) => void;
}

const CONTENT_TYPES = [
  { type: 'educational', label: 'Educational', cls: 'type-educational' },
  { type: 'entertaining', label: 'Entertaining', cls: 'type-entertaining' },
  { type: 'promotional', label: 'Promotional', cls: 'type-promotional' },
  { type: 'behind-the-scenes', label: 'BTS', cls: 'type-behind-the-scenes' },
  { type: 'ugc', label: 'UGC', cls: 'type-ugc' },
  { type: 'trend-based', label: 'Trend', cls: 'type-trend-based' },
  { type: 'testimonial', label: 'Testimonial', cls: 'type-testimonial' },
  { type: 'announcement', label: 'News', cls: 'type-announcement' },
];

export default function CalendarGrid({ calendarDays, onDayClick }: CalendarGridProps) {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = filterType
    ? calendarDays.map(d => d.is_rest_day || d.content_type === filterType ? d : { ...d, _dimmed: true })
    : calendarDays;

  const usedTypes: Set<string> = new Set(calendarDays.filter(d => !d.is_rest_day).map(d => d.content_type as string));

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Legend / filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterType(null)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-all',
              filterType === null
                ? 'bg-white/15 border-white/20 text-foreground'
                : 'bg-white/3 border-white/5 text-muted-foreground hover:bg-white/8'
            )}
          >
            All days
          </button>
          {CONTENT_TYPES.filter(c => usedTypes.has(c.type)).map(({ type, label, cls }) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? null : type)}
              className={cn(
                'px-2.5 py-1 rounded-full border text-[10px] font-medium transition-all',
                cls,
                filterType === type ? 'ring-1 ring-white/30 scale-105' : 'opacity-80 hover:opacity-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/3 border border-white/5">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'grid' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            title="Grid view"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'list' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            title="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}
        >
          {(filtered as (CalendarDay & { _dimmed?: boolean })[]).map((day) => (
            <div
              key={day.day}
              className={cn('transition-opacity duration-200', day._dimmed && 'opacity-20')}
            >
              <DayCard
                day={day}
                onClick={day.is_rest_day || day._dimmed ? undefined : () => onDayClick(day)}
              />
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="flex flex-col gap-2">
          {(filtered as (CalendarDay & { _dimmed?: boolean })[]).map((day) => {
            if (day.is_rest_day) {
              return (
                <div key={day.day} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/3 bg-white/1 opacity-40">
                  <span className="w-8 text-xs font-bold text-muted-foreground text-center">{day.day}</span>
                  <span className="text-xs text-muted-foreground">Rest Day</span>
                </div>
              );
            }
            return (
              <button
                key={day.day}
                onClick={() => !day._dimmed && onDayClick(day)}
                className={cn(
                  'flex items-start gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.005]',
                  `type-${day.content_type}`,
                  day._dimmed && 'opacity-20 cursor-default'
                )}
              >
                <div className="shrink-0 text-center">
                  <div className="text-xs font-black opacity-70">Day</div>
                  <div className="text-xl font-black">{day.day}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{day.content_type}</span>
                    {day.date && <span className="text-[10px] opacity-50">{day.date}</span>}
                  </div>
                  <p className="text-sm font-medium leading-tight line-clamp-2">{day.hook}</p>
                  <p className="text-xs opacity-60 mt-1 line-clamp-1">{day.content_idea}</p>
                </div>
                <div className="shrink-0 flex gap-0.5 mt-1">
                  {day.all_platforms.map(p => (
                    <span key={p} className="text-xs" title={p}>
                      {p === 'instagram' ? '📸' : p === 'twitter' ? '𝕏' : p === 'linkedin' ? '💼' : p === 'tiktok' ? '🎵' : '▶'}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
