'use client';
import { Download, RefreshCw, Clock, CalendarDays } from 'lucide-react';
import { Button } from './ui/button';
import { CalendarState } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface ExportBarProps {
  state: CalendarState;
  onRegenerate: () => void;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportBar({ state, onRegenerate }: ExportBarProps) {
  const { brandConfig, calendarDays, dayPosts, generatedAt } = state;
  const activeDays = (calendarDays || []).filter(d => !d.is_rest_day).length;
  const brandName = brandConfig?.brandName || 'My Brand';

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, calendarDays, dayPosts, brandName }),
      });
      const blob = await res.blob();
      downloadBlob(blob, `${brandName}-calendar.${format}`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass border border-white/5">
      {/* Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {generatedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Generated {formatDistanceToNow(new Date(generatedAt), { addSuffix: true })}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4" />
          <span className="text-foreground font-medium">{activeDays}</span> active days
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => handleExport('csv')}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => handleExport('json')}
        >
          <Download className="w-3.5 h-3.5" />
          Export JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
          onClick={onRegenerate}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </Button>
      </div>
    </div>
  );
}
