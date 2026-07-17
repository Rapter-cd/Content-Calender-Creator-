import { z } from 'zod';
import { BrandConfig, TrendItem, CalendarDay, DayPosts } from '../types';

// Zod schemas for structured output

export const PlatformSchema = z.enum(['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube']);

export const ContentTypeSchema = z.enum([
  'educational',
  'entertaining',
  'promotional',
  'behind-the-scenes',
  'ugc',
  'trend-based',
  'testimonial',
  'announcement'
]);

export const TrendItemSchema = z.object({
  id: z.number(),
  topic: z.string(),
  angle: z.string(),
  content_type: ContentTypeSchema,
  best_platforms: z.array(PlatformSchema),
  why_trending: z.string(),
  hook_ideas: z.array(z.string())
});

export const TrendsResponseSchema = z.object({
  trends: z.array(TrendItemSchema).length(15)
});

export const CalendarDaySchema = z.object({
  day: z.number(),
  date: z.string(),
  theme: z.string(),
  content_type: ContentTypeSchema,
  hook: z.string(),
  primary_platform: PlatformSchema,
  all_platforms: z.array(PlatformSchema),
  trend_used: z.string(),
  content_idea: z.string(),
  is_rest_day: z.boolean()
});

export const CalendarResponseSchema = z.object({
  calendarDays: z.array(CalendarDaySchema).length(30)
});

export const PlatformPostSchema = z.object({
  caption: z.string(),
  hashtags: z.array(z.string()),
  cta: z.string(),
  character_count: z.number(),
  best_time_to_post: z.string().optional()
});

export const DayPostsSchema = z.object({
  day: z.number(),
  posts: z.object({
    instagram: PlatformPostSchema.optional(),
    twitter: PlatformPostSchema.optional(),
    linkedin: PlatformPostSchema.optional(),
    tiktok: PlatformPostSchema.optional(),
    youtube: PlatformPostSchema.optional(),
  })
});

// LangGraph State Interface
export interface AgentState {
  brandConfig: BrandConfig;
  currentDate: string;
  startDate: string;
  trends: TrendItem[];
  calendarDays: CalendarDay[];
  dayPosts: Record<string, DayPosts>; // Keyed by day number as string
  validationErrors: Record<string, string[]>;
  retryCount: Record<string, number>;
}
