'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAgentPipeline } from '@/hooks/useAgentPipeline';
import { useCalendar } from '@/hooks/useCalendar';
import { loadCalendar, saveCalendar } from '@/lib/storage';
import { BrandConfig, DayPosts, CalendarState } from '@/lib/types';
import AgentPipeline from '@/components/AgentPipeline';
import CalendarGrid from '@/components/CalendarGrid';
import PostDrawer from '@/components/PostDrawer';
import TrendsBadges from '@/components/TrendsBadges';
import ExportBar from '@/components/ExportBar';
import { Sparkles, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function CalendarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isGenerating = searchParams.get('generating') === 'true';

  // Prevent SSR/hydration mismatch — only read localStorage after mount
  const [isMounted, setIsMounted] = useState(false);
  const [savedState, setSavedState] = useState<CalendarState | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedState(loadCalendar());
  }, []);

  const { state, runPipeline, reset } = useAgentPipeline();
  const { selectedDay, isDrawerOpen, openDay, closeDrawer, navigateDay } = useCalendar();

  // Local dayPosts so individual-day regeneration / edits update the view
  const [localDayPosts, setLocalDayPosts] = useState<DayPosts[]>([]);

  // Start the pipeline when navigating here with ?generating=true
  useEffect(() => {
    if (isGenerating) {
      const raw = sessionStorage.getItem('brandConfig');
      if (raw) {
        const brandConfig: BrandConfig = JSON.parse(raw);
        runPipeline(brandConfig);
        router.replace('/calendar');
      } else {
        router.push('/create');
      }
    }
  }, [isGenerating, runPipeline, router]);

  // Sync localDayPosts when the pipeline finishes
  useEffect(() => {
    if (state.dayPosts.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalDayPosts(state.dayPosts);
    }
  }, [state.dayPosts]);

  // Merge: prefer fresh pipeline state, fallback to localStorage
  const displayState = state.status !== 'idle' ? state : (savedState || state);
  const effectiveDayPosts = localDayPosts.length > 0 ? localDayPosts : displayState.dayPosts;
  const { calendarDays, trends, status } = displayState;
  const activeDays = calendarDays.filter(d => !d.is_rest_day);

  const currentActiveIndex = activeDays.findIndex(d => d.day === selectedDay?.day);
  const selectedDayPost = selectedDay ? effectiveDayPosts.find(p => p.day === selectedDay.day) : undefined;

  const handlePrev = () => navigateDay(calendarDays, effectiveDayPosts, 'prev');
  const handleNext = () => navigateDay(calendarDays, effectiveDayPosts, 'next');
  const handleRegenerate = () => { reset(); router.push('/create'); };

  // Handle single-day post update (inline edit or per-day AI regeneration)
  const handleDayPostUpdate = useCallback((updated: DayPosts) => {
    setLocalDayPosts(prev => {
      const next = prev.map(p => p.day === updated.day ? updated : p);
      if (displayState.brandConfig) {
        saveCalendar({ ...displayState, dayPosts: next } as CalendarState);
      }
      return next;
    });
  }, [displayState]);

  const isRunning = status === 'researching' || status === 'planning' || status === 'writing';
  const isDone = status === 'done';
  const hasError = status === 'error';
  // Show empty state only after mount to avoid SSR/CSR mismatch
  const isEmpty = isMounted && status === 'idle' && !savedState;

  const exportState = { ...displayState, dayPosts: effectiveDayPosts } as CalendarState;

  // Before client mount, show a neutral loader so SSR and client match
  if (!isMounted && !isGenerating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Running / error state */}
      {(isRunning || hasError) && (
        <AgentPipeline
          state={state.status !== 'idle' ? state : displayState}
          onRetry={hasError ? () => {
            const raw = sessionStorage.getItem('brandConfig');
            if (raw) runPipeline(JSON.parse(raw));
          } : undefined}
        />
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className="text-6xl mb-6 animate-float">📅</div>
          <h2 className="text-2xl font-bold mb-3">No calendar yet</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Create your first AI-powered content calendar to get started.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create My Calendar
          </Link>
        </div>
      )}

      {/* Calendar view */}
      {isDone && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h1 className="text-xl font-bold">
                  {displayState.brandConfig?.brandName}&apos;s Content Calendar
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                30-day plan · {activeDays.length} active days ·{' '}
                {displayState.brandConfig?.platforms.join(', ')}
              </p>
            </div>
          </div>

          {/* Export bar */}
          <ExportBar state={exportState} onRegenerate={handleRegenerate} />

          {/* Trends badges */}
          <TrendsBadges trends={trends} />

          {/* Calendar grid */}
          <CalendarGrid calendarDays={calendarDays} onDayClick={openDay} />
        </div>
      )}

      {/* Post drawer */}
      <PostDrawer
        day={selectedDay}
        dayPost={selectedDayPost}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentActiveIndex > 0}
        hasNext={currentActiveIndex < activeDays.length - 1}
        brandConfig={displayState.brandConfig}
        onDayPostUpdate={handleDayPostUpdate}
      />
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CalendarContent />
    </Suspense>
  );
}
