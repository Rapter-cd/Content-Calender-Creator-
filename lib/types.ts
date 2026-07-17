export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';

export type ContentType =
  | 'educational'
  | 'entertaining'
  | 'promotional'
  | 'behind-the-scenes'
  | 'ugc'
  | 'trend-based'
  | 'testimonial'
  | 'announcement';

export type BrandVoice =
  | 'professional'
  | 'casual-friendly'
  | 'witty-humorous'
  | 'inspirational'
  | 'authoritative';

export interface BrandConfig {
  brandName: string;
  niche: string;
  targetAudience: string;
  brandVoice: BrandVoice;
  platforms: Platform[];
  postsPerWeek: number;
  goals: string[];
  primaryColor?: string;
}

export interface TrendItem {
  id: number;
  topic: string;
  angle: string;
  content_type: ContentType;
  best_platforms: Platform[];
  why_trending: string;
  hook_ideas: string[];
}

export interface CalendarDay {
  day: number;
  date: string;
  theme: string;
  content_type: ContentType;
  hook: string;
  primary_platform: Platform;
  all_platforms: Platform[];
  trend_used: string;
  content_idea: string;
  is_rest_day: boolean;
}

export interface PlatformPost {
  caption: string;
  hashtags: string[];
  cta: string;
  character_count: number;
  best_time_to_post?: string;
}

export interface DayPosts {
  day: number;
  posts: Partial<Record<Platform, PlatformPost>>;
}

export interface CalendarState {
  brandConfig: BrandConfig | null;
  trends: TrendItem[];
  calendarDays: CalendarDay[];
  dayPosts: DayPosts[];
  generatedAt: string;
  status: 'idle' | 'researching' | 'planning' | 'writing' | 'validating' | 'retrying' | 'done' | 'error';
  agentProgress: {
    trends: 'idle' | 'running' | 'done' | 'error';
    planner: 'idle' | 'running' | 'done' | 'error';
    copywriter: 'idle' | 'running' | 'done' | 'error';
    validator: 'idle' | 'running' | 'done' | 'error';
    retrier: 'idle' | 'running' | 'done' | 'error';
  };
  error?: string;
}
