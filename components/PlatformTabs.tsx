'use client';
import { useState, useCallback } from 'react';
import { DayPosts, Platform, PlatformPost } from '@/lib/types';
import { Copy, Check, Clock, Edit2, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const platformConfig: Record<Platform, { emoji: string; label: string; color: string; maxChars?: number; charLabel?: string }> = {
  instagram: { emoji: '📸', label: 'Instagram', color: 'text-pink-400', maxChars: 2200, charLabel: 'Max 2,200' },
  twitter: { emoji: '𝕏', label: 'Twitter/X', color: 'text-blue-400', maxChars: 280, charLabel: 'Max 280' },
  linkedin: { emoji: '💼', label: 'LinkedIn', color: 'text-sky-400', maxChars: 3000, charLabel: 'Max 3,000' },
  tiktok: { emoji: '🎵', label: 'TikTok', color: 'text-violet-400', maxChars: 150, charLabel: 'Max 150' },
  youtube: { emoji: '▶', label: 'YouTube', color: 'text-red-400', maxChars: 5000, charLabel: 'Max 5,000' },
};

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all duration-200',
        copied
          ? 'bg-green-500/20 text-green-400'
          : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
      )}
      title={label || 'Copy to clipboard'}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
}

function CharCounter({ text, max }: { text: string; max?: number }) {
  const count = text.length;
  const pct = max ? count / max : 0;
  const color = pct > 1 ? 'text-red-400' : pct > 0.85 ? 'text-amber-400' : 'text-muted-foreground';
  return (
    <span className={cn('text-xs tabular-nums', color)}>
      {count}{max ? `/${max}` : ''} chars
    </span>
  );
}

interface EditableTextProps {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  max?: number;
  placeholder?: string;
}
function EditableText({ value, onChange, multiline, max, placeholder }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (!editing) {
    return (
      <div
        className="relative group cursor-text"
        onClick={() => { setDraft(value); setEditing(true); }}
      >
        <p className={cn(
          'text-sm leading-relaxed whitespace-pre-wrap glass rounded-xl p-4 pr-8 transition-all',
          'group-hover:border-violet-500/30 group-hover:bg-violet-500/3'
        )}>
          {value || <span className="text-muted-foreground/40 italic">{placeholder}</span>}
        </p>
        <Edit2 className="absolute top-3 right-3 w-3 h-3 text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-opacity" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {multiline ? (
        <textarea
          autoFocus
          rows={6}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/40 text-sm text-foreground resize-none focus:outline-none leading-relaxed"
        />
      ) : (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-violet-500/5 border border-violet-500/40 text-sm text-foreground focus:outline-none"
        />
      )}
      <div className="flex items-center justify-between">
        <CharCounter text={draft} max={max} />
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={cancel} className="h-7 px-2 text-xs gap-1">
            <X className="w-3 h-3" /> Cancel
          </Button>
          <Button size="sm" onClick={save} className="h-7 px-3 text-xs gap-1 bg-violet-600 hover:bg-violet-500 text-white">
            <Save className="w-3 h-3" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PostContentProps {
  post: PlatformPost;
  platform: Platform;
  onUpdate: (updated: PlatformPost) => void;
}

function PostContent({ post, platform, onUpdate }: PostContentProps) {
  const cfg = platformConfig[platform];
  const [hashtagsExpanded, setHashtagsExpanded] = useState(true);

  const fullPostText = `${post.caption}\n\n${post.hashtags.join(' ')}\n\n${post.cta}`;

  return (
    <div className="flex flex-col gap-5">
      {/* Platform header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cfg.emoji}</span>
          <span className={cn('font-semibold text-sm', cfg.color)}>{cfg.label}</span>
          {cfg.charLabel && (
            <span className="text-xs text-muted-foreground/50 bg-white/5 px-2 py-0.5 rounded-full">{cfg.charLabel}</span>
          )}
        </div>
        <CopyButton text={fullPostText} label="Copy All" />
      </div>

      {/* Caption */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Caption</span>
          <div className="flex items-center gap-2">
            <CharCounter text={post.caption} max={cfg.maxChars} />
            <CopyButton text={post.caption} />
          </div>
        </div>
        <EditableText
          value={post.caption}
          onChange={v => onUpdate({ ...post, caption: v })}
          multiline
          max={cfg.maxChars}
          placeholder="Caption will appear here..."
        />
      </div>

      {/* Hashtags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
            onClick={() => setHashtagsExpanded(p => !p)}
          >
            Hashtags <span className="text-violet-400 ml-1">({post.hashtags.length})</span>
            {hashtagsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <CopyButton text={post.hashtags.join(' ')} />
        </div>
        {hashtagsExpanded && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl glass">
            {post.hashtags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 cursor-default hover:bg-violet-500/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Call to Action</span>
          <CopyButton text={post.cta} />
        </div>
        <EditableText
          value={post.cta}
          onChange={v => onUpdate({ ...post, cta: v })}
          placeholder="Call to action..."
        />
      </div>

      {/* Best time */}
      {post.best_time_to_post && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-muted-foreground">Best time to post:</span>
          <span className="text-xs font-semibold text-amber-300">{post.best_time_to_post}</span>
        </div>
      )}
    </div>
  );
}

interface PlatformTabsProps {
  dayPost: DayPosts | undefined;
  platforms: Platform[];
  onUpdatePost?: (dayPost: DayPosts) => void;
}

export default function PlatformTabs({ dayPost, platforms, onUpdatePost }: PlatformTabsProps) {
  const [activeTab, setActiveTab] = useState<Platform>(platforms[0]);
  const [localPosts, setLocalPosts] = useState<DayPosts | undefined>(dayPost);

  const handleUpdate = useCallback((platform: Platform, updated: PlatformPost) => {
    if (!localPosts) return;
    const newPosts: DayPosts = {
      ...localPosts,
      posts: { ...localPosts.posts, [platform]: updated },
    };
    setLocalPosts(newPosts);
    onUpdatePost?.(newPosts);
  }, [localPosts, onUpdatePost]);

  // Sync when dayPost changes
  if (!dayPost || !platforms.length) {
    return (
      <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground text-sm">
        <span className="text-2xl">📝</span>
        <span>No posts generated for this day.</span>
      </div>
    );
  }

  const posts = localPosts || dayPost;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-5 p-1 rounded-2xl bg-white/3 border border-white/5">
        {platforms.map((platform) => {
          const config = platformConfig[platform];
          const hasPost = !!posts.posts[platform];
          return (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200',
                activeTab === platform
                  ? 'bg-white/10 text-foreground shadow-sm scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                !hasPost && 'opacity-30 cursor-not-allowed'
              )}
              disabled={!hasPost}
            >
              <span className="text-base">{config.emoji}</span>
              <span className="hidden sm:inline">{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {posts.posts[activeTab] ? (
        <PostContent
          post={posts.posts[activeTab]!}
          platform={activeTab}
          onUpdate={(updated) => handleUpdate(activeTab, updated)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-24 gap-1 text-muted-foreground text-sm">
          <span>No post generated for {platformConfig[activeTab]?.label}</span>
        </div>
      )}
    </div>
  );
}
