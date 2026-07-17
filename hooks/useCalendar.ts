'use client';
import { useState, useCallback } from 'react';
import { CalendarDay, DayPosts } from '@/lib/types';

export function useCalendar() {
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDay = useCallback((day: CalendarDay) => {
    setSelectedDay(day);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const navigateDay = useCallback((calendarDays: CalendarDay[], dayPosts: DayPosts[], direction: 'prev' | 'next') => {
    if (!selectedDay) return;
    const currentIndex = calendarDays.findIndex(d => d.day === selectedDay.day);
    const activeDays = calendarDays.filter(d => !d.is_rest_day);
    const currentActiveIndex = activeDays.findIndex(d => d.day === selectedDay.day);
    
    let nextDay: CalendarDay | undefined;
    if (direction === 'prev') {
      nextDay = activeDays[currentActiveIndex - 1];
    } else {
      nextDay = activeDays[currentActiveIndex + 1];
    }
    
    if (nextDay) {
      setSelectedDay(nextDay);
    }
  }, [selectedDay]);

  return { selectedDay, isDrawerOpen, openDay, closeDrawer, navigateDay };
}
