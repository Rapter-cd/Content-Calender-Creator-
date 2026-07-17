'use client';
import AgentCard from './AgentCard';
import { CalendarState } from '@/lib/types';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface AgentPipelineProps {
  state: CalendarState;
  onRetry?: () => void;
}

export default function AgentPipeline({ state, onRetry }: AgentPipelineProps) {
  const { agentProgress, status, brandConfig, trends } = state;

  const agents = [
    {
      name: 'Trend Researcher',
      emoji: '🔍',
      description:
        status === 'researching'
          ? `Scanning trending topics in ${brandConfig?.niche || 'your niche'}...`
          : agentProgress.trends === 'done'
          ? `Found ${trends.length} trending topics`
          : 'Identifies 15 viral topics for your niche',
      status: agentProgress.trends,
    },
    {
      name: 'Content Planner',
      emoji: '📋',
      description:
        status === 'planning'
          ? `Mapping ${trends.length} trends to a 30-day schedule...`
          : agentProgress.planner === 'done'
          ? 'Created your 30-day content roadmap'
          : 'Maps trends to a 30-day posting schedule',
      status: agentProgress.planner,
    },
    {
      name: 'Copywriter',
      emoji: '✍️',
      description:
        status === 'writing'
          ? 'Writing platform-specific posts for all active days...'
          : agentProgress.copywriter === 'done'
          ? 'All posts written and ready'
          : 'Writes ready-to-publish posts per platform',
      status: agentProgress.copywriter,
    },
    {
      name: 'Validator',
      emoji: '🔍',
      description:
        status === 'validating'
          ? 'Checking character limits, hashtags, and CTAs...'
          : agentProgress.validator === 'done'
          ? 'Validation complete'
          : 'Verifies posts against platform constraints',
      status: agentProgress.validator,
    },
    {
      name: 'Self-Corrector',
      emoji: '🔄',
      description:
        status === 'retrying'
          ? 'Rewriting failed posts...'
          : agentProgress.retrier === 'done'
          ? 'All retries complete'
          : 'Automatically rewrites posts that fail validation',
      status: agentProgress.retrier,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            AI Pipeline Running
          </div>
          <h2 className="text-2xl font-bold mb-2">Your agents are hard at work</h2>
          <p className="text-muted-foreground">
            The AI pipeline is generating your 30-day content calendar. This may take 30–90 seconds.
          </p>
        </div>

        {/* Agent Cards */}
        <div className="flex flex-col gap-4 relative">
          {/* Connector lines */}
          <div className="absolute left-[2.25rem] top-16 bottom-16 w-px bg-gradient-to-b from-blue-500/30 via-violet-500/30 to-green-500/30 hidden sm:block" />

          {agents.map((agent, index) => (
            <div key={agent.name} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
              <AgentCard {...agent} index={index} />
              {index < agents.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error state */}
        {status === 'error' && (
          <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-center animate-slide-up">
            <p className="text-red-400 text-sm mb-3">Something went wrong during generation.</p>
            <p className="text-muted-foreground text-xs mb-4">{state.error}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry Pipeline
              </Button>
            )}
          </div>
        )}

        {/* Time estimate */}
        {(status === 'researching' || status === 'planning' || status === 'writing' || status === 'validating' || status === 'retrying') && (
          <p className="text-center text-xs text-muted-foreground mt-6">
            ⏱ Estimated time: {status === 'researching' ? '10–15s' : status === 'planning' ? '15–20s' : status === 'writing' ? '30–60s' : status === 'retrying' ? '10-20s' : '5s'}
          </p>
        )}
      </div>
    </div>
  );
}
