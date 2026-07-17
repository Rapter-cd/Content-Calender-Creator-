'use client';
import { useState } from 'react';
import { BrandConfig, BrandVoice } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const brandVoiceOptions: { value: BrandVoice; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Polished, formal, trustworthy' },
  { value: 'casual-friendly', label: 'Casual & Friendly', desc: 'Warm, approachable, conversational' },
  { value: 'witty-humorous', label: 'Witty & Humorous', desc: 'Playful, clever, entertaining' },
  { value: 'inspirational', label: 'Inspirational', desc: 'Motivating, empowering, uplifting' },
  { value: 'authoritative', label: 'Authoritative', desc: 'Expert, confident, decisive' },
];

interface BrandFormProps {
  initialData: Partial<BrandConfig>;
  onNext: (data: Partial<BrandConfig>) => void;
}

export default function BrandForm({ initialData, onNext }: BrandFormProps) {
  const [formData, setFormData] = useState({
    brandName: initialData.brandName || '',
    niche: initialData.niche || '',
    targetAudience: initialData.targetAudience || '',
    brandVoice: (initialData.brandVoice || 'casual-friendly') as BrandVoice,
    postsPerWeek: initialData.postsPerWeek || 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.niche || !formData.targetAudience) return;
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Brand Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="brandName">
          Brand Name <span className="text-red-400">*</span>
        </label>
        <input
          id="brandName"
          type="text"
          placeholder="e.g. Glow & Grow, TechPulse, FitMind"
          value={formData.brandName}
          onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
        />
      </div>

      {/* Niche */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="niche">
          Niche / Industry <span className="text-red-400">*</span>
        </label>
        <input
          id="niche"
          type="text"
          placeholder="e.g. sustainable fashion, SaaS B2B tools, personal finance"
          value={formData.niche}
          onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
        />
      </div>

      {/* Target Audience */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="audience">
          Target Audience <span className="text-red-400">*</span>
        </label>
        <textarea
          id="audience"
          rows={3}
          placeholder="e.g. Women aged 25-40 interested in eco-friendly products and sustainable living..."
          value={formData.targetAudience}
          onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all resize-none"
        />
      </div>

      {/* Brand Voice */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold">Brand Voice</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {brandVoiceOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, brandVoice: opt.value }))}
              className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                formData.brandVoice === opt.value
                  ? 'border-violet-500/60 bg-violet-500/10 text-foreground'
                  : 'border-white/5 bg-white/2 text-muted-foreground hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Posts per week */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="postsPerWeek">
          Posts Per Week: <span className="text-violet-400">{formData.postsPerWeek}</span>
        </label>
        <input
          id="postsPerWeek"
          type="range"
          min={1}
          max={7}
          value={formData.postsPerWeek}
          onChange={(e) => setFormData(prev => ({ ...prev, postsPerWeek: parseInt(e.target.value) }))}
          className="w-full accent-violet-500"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1/week</span>
          <span>7/week</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!formData.brandName || !formData.niche || !formData.targetAudience}
        className="w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl"
      >
        <Sparkles className="w-4 h-4" />
        Next — Select Platforms
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
