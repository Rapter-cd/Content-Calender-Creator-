'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, CalendarDays, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg animate-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
              ContentAI
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === '/'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              Home
            </Link>
            <Link
              href="/calendar"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === '/calendar'
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              <CalendarDays className="w-4 h-4" />
              My Calendar
            </Link>
            <Link
              href="/create"
              className="flex items-center gap-1.5 ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              Create Calendar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
