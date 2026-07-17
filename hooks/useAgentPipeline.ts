'use client';
import { useState, useCallback } from 'react';
import { BrandConfig, TrendItem, CalendarDay, DayPosts, CalendarState } from '@/lib/types';
import { saveCalendar } from '@/lib/storage';

export function useAgentPipeline() {
  const [state, setState] = useState<CalendarState>({
    brandConfig: null,
    trends: [],
    calendarDays: [],
    dayPosts: [],
    generatedAt: '',
    status: 'idle',
    agentProgress: {
      trends: 'idle',
      planner: 'idle',
      copywriter: 'idle',
      validator: 'idle',
      retrier: 'idle',
    },
  });

  const runPipeline = useCallback(async (brandConfig: BrandConfig) => {
    setState(prev => ({
      ...prev,
      brandConfig,
      status: 'researching',
      agentProgress: { trends: 'running', planner: 'idle', copywriter: 'idle', validator: 'idle', retrier: 'idle' },
    }));

    try {
      const res = await fetch('/api/agent/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandConfig }),
      });
      
      if (!res.body) throw new Error('No response body');
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      let isStreamDone = false;
      let finalDayPosts: Record<string, any> = {};
      let finalTrends: TrendItem[] = [];
      let finalCalendarDays: CalendarDay[] = [];
      
      let buffer = '';

      while (!isStreamDone) {
        const { value, done: readerDone } = await reader.read();
        isStreamDone = readerDone;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }
        
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        
        for (const eventBlock of events) {
          if (eventBlock.startsWith('data: ')) {
            const data = eventBlock.slice(6);
            if (data.trim() === '[DONE]') {
              isStreamDone = true;
              break;
            }
            
            try {
              const payload = JSON.parse(data);
              if (payload.error) throw new Error(payload.error);
              
              const nodeName = payload.node;
              const nodeState = payload.state;
              
              if (nodeState.dayPosts) finalDayPosts = nodeState.dayPosts;
              if (nodeState.trends) finalTrends = nodeState.trends;
              if (nodeState.calendarDays) finalCalendarDays = nodeState.calendarDays;
              
              if (nodeName === 'research_trends') {
                setState(prev => ({ 
                  ...prev, 
                  trends: nodeState.trends, 
                  status: 'planning', 
                  agentProgress: { ...prev.agentProgress, trends: 'done', planner: 'running' } 
                }));
              } else if (nodeName === 'plan_calendar') {
                setState(prev => ({ 
                  ...prev, 
                  calendarDays: nodeState.calendarDays, 
                  status: 'writing', 
                  agentProgress: { ...prev.agentProgress, planner: 'done', copywriter: 'running' } 
                }));
              } else if (nodeName === 'write_posts') {
                setState(prev => ({ 
                  ...prev, 
                  status: 'validating', 
                  agentProgress: { ...prev.agentProgress, copywriter: 'done', validator: 'running' } 
                }));
              } else if (nodeName === 'validate_posts') {
                const hasErrors = Object.keys(nodeState.validationErrors || {}).some(
                  day => (nodeState.retryCount?.[day] ?? 0) < 1
                );
                if (hasErrors) {
                  setState(prev => ({ 
                    ...prev, 
                    status: 'retrying', 
                    agentProgress: { ...prev.agentProgress, validator: 'done', retrier: 'running' } 
                  }));
                }
              } else if (nodeName === 'retry_failed_posts') {
                 setState(prev => ({ 
                   ...prev, 
                   status: 'validating', 
                   agentProgress: { ...prev.agentProgress, retrier: 'done', validator: 'running' } 
                 }));
              }
            } catch (e: any) {
              // Only throw if it's not a JSON parsing error, although buffering should prevent them
              if (!(e instanceof SyntaxError)) {
                throw e;
              }
            }
          }
        }
      }
      
      // Map final dayPosts from Record<string, DayPosts> to DayPosts[]
      const dayPostsArray = Object.values(finalDayPosts) as DayPosts[];
      
      const finalState: CalendarState = {
        brandConfig,
        trends: finalTrends,
        calendarDays: finalCalendarDays,
        dayPosts: dayPostsArray,
        generatedAt: new Date().toISOString(),
        status: 'done',
        agentProgress: { trends: 'done', planner: 'done', copywriter: 'done', validator: 'done', retrier: 'done' },
      };

      setState(finalState);
      saveCalendar(finalState);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Pipeline failed';
      setState(prev => ({
        ...prev,
        status: 'error',
        error: message,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      brandConfig: null,
      trends: [],
      calendarDays: [],
      dayPosts: [],
      generatedAt: '',
      status: 'idle',
      agentProgress: { trends: 'idle', planner: 'idle', copywriter: 'idle', validator: 'idle', retrier: 'idle' },
    });
  }, []);

  return { state, runPipeline, reset };
}
