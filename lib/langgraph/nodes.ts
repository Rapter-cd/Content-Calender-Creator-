import { ChatGroq } from '@langchain/groq';
import { getTrendResearcherPrompt, getContentPlannerPrompt, getCopywriterPrompt } from '../agents';
import { 
  AgentState, 
  TrendsResponseSchema, 
  CalendarResponseSchema, 
  DayPostsSchema 
} from './schema';
import { CalendarDay } from '../types';

import pLimit from 'p-limit';

export const MAX_RETRIES = 1;

// Helper to initialize LLM
const getModel = (modelName = 'llama-3.3-70b-versatile', maxTokens?: number) => new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: modelName,
  ...(maxTokens && { max_tokens: maxTokens }),
});

async function callWithStructuredFallback<T>(
  chainCall: () => Promise<any>,
  maxRetries: number = 3
): Promise<T> {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await chainCall();
    } catch (e: any) {
      lastError = e;
      const isToolUseFailed = e?.code === 'tool_use_failed' || 
                              e?.error?.code === 'tool_use_failed' ||
                              e?.error?.error?.code === 'tool_use_failed' ||
                              e?.message?.includes('tool_use_failed');

      if (isToolUseFailed) {
        let failedGen = e?.failed_generation || 
                          e?.error?.failed_generation || 
                          e?.error?.error?.failed_generation;
                          
        if (!failedGen && typeof e?.message === 'string') {
          const match = e.message.match(/"failed_generation"\s*:\s*"([\s\S]*?)"}/);
          if (match) {
            try {
              failedGen = JSON.parse(`"${match[1]}"`);
            } catch {}
          }
        }

        if (failedGen) {
          try {
            if (typeof failedGen === 'string') {
              const jsonStart = failedGen.search(/[{[]/);
              const cleaned = jsonStart >= 0 ? failedGen.slice(jsonStart) : failedGen;
              return JSON.parse(cleaned) as T;
            } else {
              return failedGen as T;
            }
          } catch (parseErr) {
            // fall through to retry
          }
        }
      }

      if (e?.status === 429 || e?.message?.includes('429')) {
        throw e;
      } else if (isToolUseFailed) {
        await new Promise(r => setTimeout(r, 2000));
      } else {
        throw e;
      }
    }
  }
  throw lastError || new Error('Exhausted all retries');
}

export async function research_trends(state: AgentState): Promise<Partial<AgentState>> {
  const model = getModel().withStructuredOutput(TrendsResponseSchema);
  const prompt = getTrendResearcherPrompt(state.brandConfig, state.currentDate);
  
  const response = await callWithStructuredFallback<any>(async () => {
    return await model.invoke([
      { role: 'system', content: 'You are an expert Social Media Trend Research Agent. Generate exactly 15 trends.' },
      { role: 'user', content: prompt }
    ]);
  });
  
  return { trends: response.trends };
}

export async function plan_calendar(state: AgentState): Promise<Partial<AgentState>> {
  const model = getModel().withStructuredOutput(CalendarResponseSchema);
  const prompt = getContentPlannerPrompt(state.brandConfig, state.trends, state.startDate);
  
  const response = await callWithStructuredFallback<any>(async () => {
    return await model.invoke([
      { role: 'system', content: 'You are an expert Content Strategy Agent. Create a 30-day calendar.' },
      { role: 'user', content: prompt }
    ]);
  });
  
  return { calendarDays: response.calendarDays };
}

export async function generatePostForDay(dayPlan: CalendarDay, state: AgentState) {
  // Enforce a deliberate 3-second spacing before execution to prevent rate limit bursts
  await new Promise(r => setTimeout(r, 3000));

  const model = getModel('llama-3.1-8b-instant', 1500).withStructuredOutput(DayPostsSchema);
  const prompt = getCopywriterPrompt(state.brandConfig, dayPlan);
  
  const response = await callWithStructuredFallback<any>(async () => {
    return await model.invoke([
      { role: 'system', content: 'You are an expert Copywriter. Output valid JSON only.' },
      { role: 'user', content: prompt }
    ]);
  });
  
  // Ensure day is correctly injected back in if omitted by LLM
  return { ...response, day: dayPlan.day };
}

export async function write_posts(state: AgentState): Promise<Partial<AgentState>> {
  const activeDays = state.calendarDays.filter(d => !d.is_rest_day);
  
  const limit = pLimit(2);
  
  const results = await Promise.allSettled(
    activeDays.map(day => limit(() => generatePostForDay(day, state)))
  );
  
  const newDayPosts: Record<string, any> = { ...state.dayPosts };
  
  activeDays.forEach((day, index) => {
    const res = results[index];
    if (res.status === 'fulfilled') {
      newDayPosts[day.day.toString()] = res.value;
    } else {
      console.error(`Error generating post for day ${day.day}:`, res.reason);
    }
  });
  
  return { dayPosts: newDayPosts };
}

export async function validate_posts(state: AgentState): Promise<Partial<AgentState>> {
  const errors: Record<string, string[]> = {};
  
  for (const [dayStr, postObj] of Object.entries(state.dayPosts)) {

    const dayErrors: string[] = [];
    
    // Check platforms inside the day post
    for (const [platform, post] of Object.entries(postObj.posts)) {
      if (!post) continue;
      
      if (!post.caption || post.caption.length < 10) {
        dayErrors.push(`caption_too_short_on_${platform}`);
      }
      if (!post.hashtags || post.hashtags.length === 0) {
        dayErrors.push(`missing_hashtags_on_${platform}`);
      }
      if (!post.cta || post.cta.trim().length === 0) {
        dayErrors.push(`missing_cta_on_${platform}`);
      }
      if (platform === 'twitter' && post.caption.length > 280) {
        dayErrors.push('exceeds_twitter_char_limit');
      }
    }
    
    if (dayErrors.length > 0) {
      errors[dayStr] = dayErrors;
    }
  }
  
  return { validationErrors: errors };
}

export async function retry_failed_posts(state: AgentState): Promise<Partial<AgentState>> {
  const daysToRetry = Object.keys(state.validationErrors).filter(
    (dayStr) => (state.retryCount[dayStr] ?? 0) < MAX_RETRIES
  );
  
  const calendarDaysMap = new Map(state.calendarDays.map(d => [d.day.toString(), d]));
  
  const limit = pLimit(1); // Stricter limit for retries

  const retried = await Promise.allSettled(
    daysToRetry.map((dayStr) => {
      const dayPlan = calendarDaysMap.get(dayStr);
      if (!dayPlan) throw new Error('Day plan not found');
      return limit(() => generatePostForDay(dayPlan, state));
    })
  );
  
  const updatedPosts = { ...state.dayPosts };
  const updatedRetryCount = { ...state.retryCount };
  
  daysToRetry.forEach((dayStr, i) => {
    updatedRetryCount[dayStr] = (updatedRetryCount[dayStr] ?? 0) + 1;
    const res = retried[i];
    if (res.status === 'fulfilled') {
      updatedPosts[dayStr] = res.value;
    }
  });
  
  return { dayPosts: updatedPosts, retryCount: updatedRetryCount };
}
