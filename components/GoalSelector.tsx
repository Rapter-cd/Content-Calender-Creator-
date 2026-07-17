'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const goalOptions = [
  { id: 'grow-followers', label: 'Grow Followers', emoji: '📈', desc: 'Increase your audience size' },
  { id: 'drive-traffic', label: 'Drive Website Traffic', emoji: '🌐', desc: 'Send people to your website' },
  { id: 'generate-leads', label: 'Generate Leads', emoji: '🧲', desc: 'Capture potential customers' },
  { id: 'brand-awareness', label: 'Build Brand Awareness', emoji: '✨', desc: 'Get your name out there' },
  { id: 'increase-sales', label: 'Increase Sales', emoji: '💰', desc: 'Convert followers to buyers' },
  { id: 'build-community', label: 'Build Community', emoji: '🤝', desc: 'Foster engagement & belonging' },
  { id: 'thought-leadership', label: 'Thought Leadership', emoji: '🧠', desc: 'Establish industry authority' },
];

interface GoalSelectorProps {
  initialGoals: string[];
  onSubmit: (goals: string[]) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function GoalSelector({
  initialGoals,
  onSubmit,
  onBack,
  isLoading,
}: GoalSelectorProps) {
  const [selected, setSelected] = useState<string[]>(initialGoals);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        What do you want to achieve with your content? Select all that apply — we'll tailor the calendar to your goals.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {goalOptions.map((goal) => {
          const isSelected = selected.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200',
                isSelected
                  ? 'border-violet-500/60 bg-violet-500/10'
                  : 'border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/5'
              )}
            >
              <span className="text-xl">{goal.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className={cn('font-medium text-sm', isSelected ? 'text-violet-300' : 'text-foreground')}>
                  {goal.label}
                </div>
                <div className="text-xs text-muted-foreground">{goal.desc}</div>
              </div>
              <div
                className={cn(
                  'w-4 h-4 rounded border-2 transition-all duration-200 shrink-0',
                  isSelected
                    ? 'bg-violet-500 border-violet-500'
                    : 'border-white/20'
                )}
              >
                {isSelected && (
                  <svg className="w-full h-full text-white" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-amber-400 text-center">Select at least one goal to continue.</p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 gap-2" disabled={isLoading}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={() => onSubmit(selected)}
          disabled={selected.length === 0 || isLoading}
          className="flex-1 gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate My Calendar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
