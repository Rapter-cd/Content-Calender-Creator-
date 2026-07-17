import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Calendar, PenLine, CheckCircle2, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6 animate-fade-in">
            <Zap className="w-4 h-4" />
            Powered by Groq · llama-3.3-70b
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="block text-foreground">Your 30-day content</span>
            <span className="block mt-2 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              calendar, written by AI.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Three specialized AI agents research trends, plan your strategy, and write
            platform-native posts for Instagram, Twitter, LinkedIn, TikTok, and YouTube.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/create"
              id="hero-cta"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-200 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Create My Calendar
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/calendar"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-foreground font-medium hover:bg-white/10 transition-all duration-200"
            >
              View Sample Calendar
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            {[
              { label: '30 Days', desc: 'Complete calendar' },
              { label: '5 Platforms', desc: 'Native posts per day' },
              { label: '3 AI Agents', desc: 'Working in sequence' },
              { label: 'Free', desc: 'No credit card needed' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three AI agents work together sequentially to produce your complete content calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              icon: <TrendingUp className="w-6 h-6" />,
              title: 'Tell us about your brand',
              desc: 'Share your niche, target audience, brand voice, platforms, and goals. Takes under 2 minutes.',
              color: 'from-violet-600/20 to-purple-600/20',
              border: 'border-violet-500/20',
            },
            {
              step: '02',
              icon: <Sparkles className="w-6 h-6" />,
              title: '3 AI agents go to work',
              desc: 'Agent 1 researches trends. Agent 2 plans your calendar. Agent 3 writes every post. Watch it happen live.',
              color: 'from-purple-600/20 to-indigo-600/20',
              border: 'border-purple-500/20',
            },
            {
              step: '03',
              icon: <Calendar className="w-6 h-6" />,
              title: 'Download your calendar',
              desc: 'Get a full 30-day calendar with platform-specific captions, hashtags, CTAs, and best posting times.',
              color: 'from-indigo-600/20 to-blue-600/20',
              border: 'border-indigo-500/20',
            },
          ].map(({ step, icon, title, desc, color, border }) => (
            <div
              key={step}
              className={`relative p-6 rounded-2xl border ${border} bg-gradient-to-br ${color} group hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl font-black text-white/5 absolute top-4 right-4">{step}</div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-violet-400 shrink-0">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl border border-white/5 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Your AI team at work</h2>
            <p className="text-muted-foreground">Each agent specializes in one part of the pipeline</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                emoji: '🔍',
                name: 'Trend Researcher',
                task: 'Scans your niche for 15 viral topics, angles, and hooks that are working right now.',
                badge: 'Agent 1',
                color: 'border-blue-500/30 bg-blue-500/5',
                badgeColor: 'bg-blue-500/20 text-blue-400',
              },
              {
                emoji: '📋',
                name: 'Content Planner',
                task: 'Maps trends to a 30-day schedule with optimal content mix, platform routing, and post frequency.',
                badge: 'Agent 2',
                color: 'border-violet-500/30 bg-violet-500/5',
                badgeColor: 'bg-violet-500/20 text-violet-400',
              },
              {
                emoji: '✍️',
                name: 'Copywriter',
                task: 'Writes platform-native captions, hashtags, and CTAs for every active day in your calendar.',
                badge: 'Agent 3',
                color: 'border-green-500/30 bg-green-500/5',
                badgeColor: 'bg-green-500/20 text-green-400',
              },
            ].map(({ emoji, name, task, badge, color, badgeColor }) => (
              <div key={name} className={`p-5 rounded-2xl border ${color} flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{emoji}</div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColor}`}>{badge}</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5">{name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{task}</p>
                </div>
                <div className="flex gap-1 mt-auto">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 rounded-full bg-white/10" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything included</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Platform-native captions for each platform',
            'Strategic hashtag sets (8–12 per post)',
            'Compelling CTAs for each platform',
            'Best posting times per platform',
            'Content type mix (40/25/20/15 ratio)',
            'Trend research for your exact niche',
            'Export as CSV or JSON',
            'Saves to browser storage',
            'Live agent progress tracking',
            'Fully editable content plan',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 p-3 rounded-xl bg-white/2 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6 animate-float">📅</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to fill your calendar?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            It takes 2 minutes to set up. The AI does the rest in under 90 seconds.
          </p>
          <Link
            href="/create"
            id="footer-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-200 shadow-2xl shadow-violet-500/30"
          >
            <Sparkles className="w-5 h-5" />
            Start for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">No credit card required · Powered by Groq (free tier)</p>
        </div>
      </section>
    </div>
  );
}
