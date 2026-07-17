'use client';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type AgentStatus = 'idle' | 'running' | 'done' | 'error';

interface AgentCardProps {
  name: string;
  emoji: string;
  description: string;
  status: AgentStatus;
  index: number;
}

export default function AgentCard({ name, emoji, description, status, index }: AgentCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-500',
        status === 'idle' && 'border-white/5 bg-white/2 opacity-60',
        status === 'running' && 'border-blue-500/40 bg-blue-500/5 animate-pulse-glow',
        status === 'done' && 'border-green-500/40 bg-green-500/5',
        status === 'error' && 'border-red-500/40 bg-red-500/5',
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300',
              status === 'idle' && 'bg-white/5',
              status === 'running' && 'bg-blue-500/20',
              status === 'done' && 'bg-green-500/20',
              status === 'error' && 'bg-red-500/20',
            )}
          >
            {emoji}
          </div>
          <div>
            <div className="font-semibold text-sm">{name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
          </div>
        </div>

        {/* Status icon */}
        <div className="shrink-0">
          {status === 'idle' && <Clock className="w-5 h-5 text-muted-foreground/40" />}
          {status === 'running' && (
            <div className="flex items-center gap-1.5">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-xs text-blue-400 font-medium">Running...</span>
            </div>
          )}
          {status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
          {status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
        </div>
      </div>

      {/* Progress bar */}
      {status === 'running' && (
        <div className="h-1 w-full bg-blue-950 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full shimmer" style={{ width: '60%' }} />
        </div>
      )}
      {status === 'done' && (
        <div className="h-1 w-full bg-green-950 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
        </div>
      )}
    </div>
  );
}
