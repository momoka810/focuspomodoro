'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Reflection {
  id: string;
  reflection_text: string;
  ai_feedback: string | null;
  session_date: string;
  created_at: string;
}

interface ReflectionCalendarProps {
  userId: string;
}

export function ReflectionCalendar({ userId }: ReflectionCalendarProps) {
  const { t } = useLanguage();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadReflections();
  }, [userId, currentDate]);

  const loadReflections = async () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', startOfMonth.toISOString().split('T')[0])
      .lte('session_date', endOfMonth.toISOString().split('T')[0])
      .order('session_date', { ascending: false });

    if (data) {
      setReflections(data);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getReflectionForDate = (date: number) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    ).toISOString().split('T')[0];
    return reflections.find((r) => r.session_date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (reflection: Reflection) => {
    setSelectedReflection(reflection);
    setIsDialogOpen(true);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <CardTitle>{t('calendar.title')}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {monthName}
              </span>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardDescription>{t('calendar.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const date = index + 1;
              const reflection = getReflectionForDate(date);
              const isToday =
                date === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <button
                  key={date}
                  onClick={() => reflection && handleDateClick(reflection)}
                  disabled={!reflection}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm
                    transition-all duration-200
                    ${reflection
                      ? 'bg-gradient-to-br from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 cursor-pointer font-medium text-orange-900'
                      : 'bg-gray-50 text-gray-400 cursor-default'
                    }
                    ${isToday ? 'ring-2 ring-orange-400' : ''}
                  `}
                >
                  {date}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedReflection?.session_date &&
                new Date(selectedReflection.session_date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
            </DialogTitle>
          </DialogHeader>
          {selectedReflection && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  {t('reflection.yourReflection')}
                </p>
                <p className="text-gray-800">{selectedReflection.reflection_text}</p>
              </div>
              {selectedReflection.ai_feedback && (
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 mb-2 font-medium">
                    {t('reflection.aiFeedback')}
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    {selectedReflection.ai_feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
