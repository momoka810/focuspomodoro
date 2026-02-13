'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { PomodoroTimer } from '@/components/pomodoro-timer';
import { GeometricArt } from '@/components/geometric-art';
import { TaskInput } from '@/components/task-input';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { SocialCounter } from '@/components/social-counter';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { AuthForm } from '@/components/auth-form';
import { UserProfile } from '@/components/user-profile';
import { TaskList } from '@/components/task-list';
import { ReportsDashboard } from '@/components/reports-dashboard';
import { GoalsManager } from '@/components/goals-manager';
import { ReflectionDialog } from '@/components/reflection-dialog';
import { ReflectionCalendar } from '@/components/reflection-calendar';
import { SessionType, PomodoroSession, FocusAnalytics } from '@/lib/types';
import { supabase, Database } from '@/lib/supabase';

function HomeContent() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [currentTask, setCurrentTask] = useState('');
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [timerProgress, setTimerProgress] = useState({ remaining: 1500, total: 1500 });
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showReflectionDialog, setShowReflectionDialog] = useState(false);

  const handleSessionComplete = useCallback(async (type: SessionType, duration: number) => {
    if (!user) return;

    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      taskName: currentTask || t('task.untitled'),
      type,
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date(),
      duration,
    };
    setSessions((prev) => [...prev, newSession]);

    const sessionType: Database['public']['Tables']['pomodoro_sessions']['Row']['session_type'] =
      type === 'focus' ? 'work' : type === 'break' ? 'short_break' : 'long_break';
    const durationMinutes = Math.floor(duration / 60);

    const insertData: Database['public']['Tables']['pomodoro_sessions']['Insert'] = {
      user_id: user.id,
      session_type: sessionType,
      duration_minutes: durationMinutes,
      completed_at: new Date().toISOString(),
    };

    await supabase.from('pomodoro_sessions').insert(insertData);

    if (type === 'focus') {
      setShowReflectionDialog(true);
    }
  }, [currentTask, t, user]);

  useEffect(() => {
    if (!user) return;

    const loadSessions = async () => {
      const { data } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(100);

      if (data) {
        const loadedSessions: PomodoroSession[] = data.map((session) => ({
          id: session.id,
          taskName: t('task.untitled'),
          type: session.session_type === 'work' ? 'focus' : 'break',
          startTime: new Date(new Date(session.completed_at).getTime() - session.duration_minutes * 60000),
          endTime: new Date(session.completed_at),
          duration: session.duration_minutes * 60,
        }));
        setSessions(loadedSessions);
      }
    };

    loadSessions();
  }, [user, t]);

  const handleTimerTick = useCallback((remainingSeconds: number, totalSeconds: number) => {
    setTimerProgress({ remaining: remainingSeconds, total: totalSeconds });
    setIsTimerActive(remainingSeconds < totalSeconds);
  }, []);

  const analytics: FocusAnalytics = useMemo(() => {
    const now = new Date();
    const todaySessions = sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return (
        session.type === 'focus' &&
        sessionDate.getDate() === now.getDate() &&
        sessionDate.getMonth() === now.getMonth() &&
        sessionDate.getFullYear() === now.getFullYear()
      );
    });

    const totalFocusTime = todaySessions.reduce(
      (acc, session) => acc + Math.floor(session.duration / 60),
      0
    );

    const hourlyData: { [key: number]: number } = {};
    todaySessions.forEach((session) => {
      const hour = new Date(session.startTime).getHours();
      hourlyData[hour] = (hourlyData[hour] || 0) + Math.floor(session.duration / 60);
    });

    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      focusMinutes: hourlyData[hour] || 0,
      intensity: Math.min(100, (hourlyData[hour] || 0) * 4),
    }));

    return {
      totalFocusTime,
      sessionsCompleted: todaySessions.length,
      hourlyDistribution,
    };
  }, [sessions]);

  const progress = 1 - timerProgress.remaining / timerProgress.total;
  const isFocusMode = timerProgress.total === 1500;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 text-gray-800 overflow-hidden">
      <div className="relative min-h-screen flex flex-col items-center justify-start px-4 py-12 space-y-16">
        <div className="absolute top-8 right-8 flex items-center gap-4 z-20">
          <LanguageSwitcher />
          <SocialCounter />
          <UserProfile />
        </div>

        <div className="relative w-full max-w-2xl">
          <GeometricArt progress={progress} isActive={isTimerActive} isFocus={isFocusMode} />

          <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-6xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500">
                {t('app.title')}
              </h1>
              <p className="text-base text-gray-600 font-normal tracking-wide">
                {t('app.subtitle')}
              </p>
            </div>

            <PomodoroTimer
              onSessionComplete={handleSessionComplete}
              onTimerTick={handleTimerTick}
              currentTask={currentTask}
            />

            <TaskInput value={currentTask} onChange={setCurrentTask} />
          </div>
        </div>

        <div className="w-full max-w-6xl space-y-8">
          <AnalyticsDashboard analytics={analytics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ReportsDashboard />
            <GoalsManager />
          </div>
          <ReflectionCalendar userId={user.id} />
          <TaskList />
        </div>

        <div className="text-xs text-gray-400 font-normal tracking-wide">
          {t('app.footer')}
        </div>
      </div>

      <ReflectionDialog
        open={showReflectionDialog}
        onOpenChange={setShowReflectionDialog}
        userId={user.id}
      />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
