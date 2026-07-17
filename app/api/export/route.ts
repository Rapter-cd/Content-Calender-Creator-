import { NextRequest, NextResponse } from 'next/server';
import { CalendarDay, DayPosts } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { format, calendarDays, dayPosts, brandName } = await req.json() as {
    format: 'csv' | 'json';
    calendarDays: CalendarDay[];
    dayPosts: DayPosts[];
    brandName: string;
  };

  if (format === 'json') {
    const data = JSON.stringify({ brand: brandName, calendar: calendarDays, posts: dayPosts }, null, 2);
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${brandName}-calendar.json"`,
      },
    });
  }

  // CSV export
  const rows = ['Day,Date,Theme,Content Type,Hook,Platform,Caption,Hashtags,CTA'];

  calendarDays.forEach(day => {
    if (day.is_rest_day) return;
    const post = dayPosts.find(p => p.day === day.day);
    const platform = day.primary_platform;
    const platformPost = post?.posts?.[platform];

    rows.push([
      day.day,
      day.date,
      `"${day.theme}"`,
      day.content_type,
      `"${day.hook}"`,
      platform,
      `"${platformPost?.caption?.replace(/"/g, '""') ?? ''}"`,
      `"${platformPost?.hashtags?.join(' ') ?? ''}"`,
      `"${platformPost?.cta ?? ''}"`,
    ].join(','));
  });

  const csv = rows.join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${brandName}-calendar.csv"`,
    },
  });
}
