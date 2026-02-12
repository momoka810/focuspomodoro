'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Calendar, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface ReportData {
  totalSessions: number;
  totalMinutes: number;
  averageSessionsPerDay: number;
  mostProductiveDay: string;
  dailyData: {
    date: string;
    sessions: number;
    minutes: number;
  }[];
}

export function ReportsDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const text = {
    ja: {
      title: '統計レポート',
      weekly: '週間',
      monthly: '月間',
      totalSessions: '完了セッション',
      totalTime: '合計集中時間',
      avgPerDay: '1日平均',
      mostProductive: '最も生産的な日',
      sessions: 'セッション',
      minutes: '分',
      loading: '読み込み中...',
    },
    en: {
      title: 'Statistics Report',
      weekly: 'Weekly',
      monthly: 'Monthly',
      totalSessions: 'Completed Sessions',
      totalTime: 'Total Focus Time',
      avgPerDay: 'Avg Per Day',
      mostProductive: 'Most Productive Day',
      sessions: 'sessions',
      minutes: 'min',
      loading: 'Loading...',
    },
  };

  const t = text[language];

  useEffect(() => {
    if (!user) return;

    const loadReportData = async () => {
      const now = new Date();
      const startDate = new Date();

      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else {
        startDate.setDate(now.getDate() - 30);
      }

      const { data } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_type', 'work')
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: true });

      if (data) {
        const dailyMap: { [key: string]: { sessions: number; minutes: number } } = {};

        data.forEach((session) => {
          const date = new Date(session.completed_at).toLocaleDateString();
          if (!dailyMap[date]) {
            dailyMap[date] = { sessions: 0, minutes: 0 };
          }
          dailyMap[date].sessions += 1;
          dailyMap[date].minutes += session.duration_minutes;
        });

        const dailyData = Object.entries(dailyMap).map(([date, stats]) => ({
          date,
          sessions: stats.sessions,
          minutes: stats.minutes,
        }));

        const totalSessions = data.length;
        const totalMinutes = data.reduce((sum, session) => sum + session.duration_minutes, 0);
        const daysInPeriod = period === 'week' ? 7 : 30;
        const averageSessionsPerDay = totalSessions / daysInPeriod;

        let mostProductiveDay = '';
        let maxMinutes = 0;
        dailyData.forEach((day) => {
          if (day.minutes > maxMinutes) {
            maxMinutes = day.minutes;
            mostProductiveDay = day.date;
          }
        });

        setReportData({
          totalSessions,
          totalMinutes,
          averageSessionsPerDay,
          mostProductiveDay,
          dailyData,
        });
      }
    };

    loadReportData();
  }, [user, period]);

  if (!reportData) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
        <div className="text-center text-gray-400">{t.loading}</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{t.title}</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setPeriod('week')}
            size="sm"
            variant={period === 'week' ? 'default' : 'outline'}
            className={period === 'week' ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white' : ''}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t.weekly}
          </Button>
          <Button
            onClick={() => setPeriod('month')}
            size="sm"
            variant={period === 'month' ? 'default' : 'outline'}
            className={period === 'month' ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white' : ''}
          >
            <BarChart className="w-4 h-4 mr-2" />
            {t.monthly}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <div className="text-sm text-gray-600">{t.totalSessions}</div>
          </div>
          <div className="text-3xl font-bold text-orange-600">{reportData.totalSessions}</div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart className="w-5 h-5 text-pink-500" />
            <div className="text-sm text-gray-600">{t.totalTime}</div>
          </div>
          <div className="text-3xl font-bold text-pink-600">{reportData.totalMinutes} {t.minutes}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <div className="text-sm text-gray-600">{t.avgPerDay}</div>
          </div>
          <div className="text-3xl font-bold text-purple-600">{reportData.averageSessionsPerDay.toFixed(1)}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <div className="text-sm text-gray-600">{t.mostProductive}</div>
          </div>
          <div className="text-lg font-bold text-emerald-600">{reportData.mostProductiveDay || '-'}</div>
        </div>
      </div>

      <div className="space-y-2">
        {reportData.dailyData.map((day, index) => {
          const maxMinutes = Math.max(...reportData.dailyData.map(d => d.minutes));
          const widthPercent = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">{day.date}</div>
              <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-pink-400 transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${widthPercent}%` }}
                >
                  {day.minutes > 0 && (
                    <span className="text-xs text-white font-semibold">
                      {day.sessions} {t.sessions} · {day.minutes} {t.minutes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
