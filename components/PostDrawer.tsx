'use client';
import { useState, useCallback } from 'react';
import { CalendarDay, DayPosts, Platform, BrandConfig } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import PlatformTabs from './PlatformTabs';
import { ChevronLeft, ChevronRight, Lightbulb, TrendingUp, RefreshCw, FileText, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const typeColors: Record<string, string> = {
  educational: 'type-educational',
  entertaining: 'type-entertaining',
  promotional: 'type-promotional',
  'behind-the-scenes': 'type-behind-the-scenes',
  ugc: 'type-ugc',
  'trend-based': 'type-trend-based',
  testimonial: 'type-testimonial',
  announcement: 'type-announcement',
};

const typeLabels: Record<string, string> = {
  educational: 'Educational',
  entertaining: 'Entertaining',
  promotional: 'Promotional',
  'behind-the-scenes': 'Behind the Scenes',
  ugc: 'UGC',
  'trend-based': 'Trend-Based',
  testimonial: 'Testimonial',
  announcement: 'Announcement',
};

const platformEmoji: Record<Platform, string> = {
  instagram: '📸',
  twitter: '𝕏',
  linkedin: '💼',
  tiktok: '🎵',
  youtube: '▶',
};

interface PostDrawerProps {
  day: CalendarDay | null;
  dayPost: DayPosts | undefined;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  brandConfig?: BrandConfig | null;
  onDayPostUpdate?: (updated: DayPosts) => void;
}

export default function PostDrawer({
  day,
  dayPost,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  brandConfig,
  onDayPostUpdate,
}: PostDrawerProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [localDayPost, setLocalDayPost] = useState<DayPosts | undefined>(dayPost);
  const [regenError, setRegenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync local when prop changes (day changes)
  if (localDayPost?.day !== dayPost?.day) {
    setLocalDayPost(dayPost);
    setRegenError(null);
  }

  const handleUpdatePost = useCallback((updated: DayPosts) => {
    setLocalDayPost(updated);
    onDayPostUpdate?.(updated);
  }, [onDayPostUpdate]);

  const handleRegenerate = async () => {
    if (!brandConfig || !day) return;
    setIsRegenerating(true);
    setRegenError(null);
    try {
      const res = await fetch('/api/agent/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandConfig, calendarDays: [day] }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const newPost: DayPosts = data.dayPosts[0];
      setLocalDayPost(newPost);
      onDayPostUpdate?.(newPost);
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : 'Failed to regenerate');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyAllPosts = async () => {
    if (!localDayPost && !dayPost) return;
    const posts = (localDayPost || dayPost)!;
    const lines: string[] = [`📅 Day ${day?.day} — ${day?.theme}\n`];
    for (const [platform, post] of Object.entries(posts.posts)) {
      if (!post) continue;
      lines.push(`\n━━━ ${platformEmoji[platform as Platform] || ''} ${platform.toUpperCase()} ━━━`);
      lines.push(post.caption);
      lines.push('');
      lines.push(post.hashtags.join(' '));
      lines.push('');
      lines.push(`CTA: ${post.cta}`);
      if (post.best_time_to_post) lines.push(`Best time: ${post.best_time_to_post}`);
    }
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!day) return null;

  const dateStr = day.date
    ? format(new Date(day.date + 'T00:00:00'), 'MMMM d, yyyy')
    : `Day ${day.day}`;

  const displayPost = localDayPost || dayPost;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] overflow-y-auto border-white/5 bg-card/98 backdrop-blur-xl p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-bold truncate">
                  Day {day.day} — {dateStr}
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{day.theme}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 px-2.5 py-1 rounded-full border text-xs font-semibold',
                  typeColors[day.content_type]
                )}
              >
                {typeLabels[day.content_type] || day.content_type}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleCopyAllPosts}
                disabled={!displayPost}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  copied
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground'
                )}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy All Posts'}
              </button>

              {brandConfig && (
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={cn('w-3.5 h-3.5', isRegenerating && 'animate-spin')} />
                  {isRegenerating ? 'Regenerating...' : 'Regenerate Day'}
                </button>
              )}

              <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-white/3 text-xs text-muted-foreground">
                <FileText className="w-3 h-3" />
                {day.all_platforms.length} platform{day.all_platforms.length !== 1 ? 's' : ''}
              </div>
            </div>

            {regenError && (
              <p className="text-xs text-red-400 mt-2 px-1">{regenError}</p>
            )}
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

            {/* Hook */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/8 to-purple-500/8 border border-violet-500/15">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Attention Hook</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground">
                "{day.hook}"
              </p>
            </div>

            {/* Content idea */}
            <div className="p-4 rounded-2xl bg-white/2 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Content Brief</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{day.content_idea}</p>
              {day.trend_used && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground/50">Trend used:</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    #{day.trend_used}
                  </span>
                </div>
              )}
            </div>

            {/* Regenerating overlay */}
            {isRegenerating && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">AI is rewriting posts for Day {day.day}...</p>
              </div>
            )}

            {/* Platform tabs */}
            {!isRegenerating && (
              <div>
                <div className="h-px bg-white/5 mb-5" />
                <PlatformTabs
                  dayPost={displayPost}
                  platforms={day.all_platforms as Platform[]}
                  onUpdatePost={handleUpdatePost}
                />
              </div>
            )}
          </div>

          {/* Footer navigation */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              disabled={!hasPrev}
              className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              Day {day.day} of 30
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="gap-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
