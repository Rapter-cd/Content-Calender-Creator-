'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrandConfig, Platform } from '@/lib/types';
import BrandForm from '@/components/BrandForm';
import PlatformSelector from '@/components/PlatformSelector';
import GoalSelector from '@/components/GoalSelector';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Brand Details', desc: 'Tell us about your brand' },
  { id: 2, label: 'Platforms', desc: 'Where you want to post' },
  { id: 3, label: 'Goals', desc: 'What you want to achieve' },
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BrandConfig>>({
    postsPerWeek: 5,
    platforms: ['instagram'],
    goals: [],
  });

  const handleStep1 = (data: Partial<BrandConfig>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2 = (platforms: Platform[]) => {
    setFormData(prev => ({ ...prev, platforms }));
    setStep(3);
  };

  const handleSubmit = (goals: string[]) => {
    const finalConfig: BrandConfig = {
      brandName: formData.brandName!,
      niche: formData.niche!,
      targetAudience: formData.targetAudience!,
      brandVoice: formData.brandVoice!,
      platforms: formData.platforms!,
      postsPerWeek: formData.postsPerWeek!,
      goals,
    };

    // Store in sessionStorage
    sessionStorage.setItem('brandConfig', JSON.stringify(finalConfig));
    router.push('/calendar?generating=true');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl animate-gradient shadow-lg mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Create Your Content Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in these details and our AI will handle the rest.</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 min-w-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    step > s.id
                      ? 'bg-green-500 text-white'
                      : step === s.id
                      ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/40'
                      : 'bg-white/10 text-muted-foreground'
                  )}
                >
                  {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span className={cn('text-[10px] font-medium truncate', step === s.id ? 'text-violet-400' : 'text-muted-foreground')}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('flex-1 h-px mx-2 transition-all duration-500', step > s.id ? 'bg-green-500/50' : 'bg-white/10')} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 sm:p-8">
          {step === 1 && <BrandForm initialData={formData} onNext={handleStep1} />}
          {step === 2 && (
            <PlatformSelector
              initialSelected={formData.platforms || []}
              onNext={handleStep2}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <GoalSelector
              initialGoals={formData.goals || []}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
            />
          )}
        </div>

        {/* Step counter */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Step {step} of {steps.length} · {steps[step - 1].desc}
        </p>
      </div>
    </div>
  );
}
