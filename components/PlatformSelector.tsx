'use client';
import { useState } from 'react';
import { Platform } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const platforms: { id: Platform; emoji: string; label: string; desc: string }[] = [
  { id: 'instagram', emoji: '📸', label: 'Instagram', desc: 'Visual content, Stories, Reels' },
  { id: 'twitter', emoji: '🐦', label: 'Twitter / X', desc: 'Short-form, news, engagement' },
  { id: 'linkedin', emoji: '💼', label: 'LinkedIn', desc: 'B2B, thought leadership' },
  { id: 'tiktok', emoji: '🎵', label: 'TikTok', desc: 'Short video, trending audio' },
  { id: 'youtube', emoji: '▶️', label: 'YouTube', desc: 'Long-form, tutorials, vlogs' },
];

interface PlatformSelectorProps {
  initialSelected: Platform[];
  onNext: (selected: Platform[]) => void;
  onBack: () => void;
}

export default function PlatformSelector({
  initialSelected,
  onNext,
  onBack,
}: PlatformSelectorProps) {
  const [selected, setSelected] = useState<Platform[]>(initialSelected);

  const toggle = (id: Platform) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Select all platforms you want to create content for. We'll write platform-native posts for each.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const isSelected = selected.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => toggle(platform.id)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 group',
                isSelected
                  ? 'border-violet-500/60 bg-violet-500/10 shadow-lg shadow-violet-500/10'
                  : 'border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/5'
              )}
            >
              <div
                className={cn(
                  'text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                  isSelected ? 'bg-violet-500/20 scale-110' : 'bg-white/5 group-hover:bg-white/8'
                )}
              >
                {platform.emoji}
              </div>
              <div>
                <div
                  className={cn(
                    'font-semibold text-sm transition-colors',
                    isSelected ? 'text-violet-300' : 'text-foreground'
                  )}
                >
                  {platform.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{platform.desc}</div>
              </div>
              {isSelected && (
                <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-amber-400 text-center">Select at least one platform to continue.</p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className="flex-1 gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
