'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Brain, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionType } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';
import { useNotification } from '@/hooks/use-notification';

interface PomodoroTimerProps {
  onSessionComplete: (type: SessionType, duration: number) => void;
  onTimerTick: (remainingSeconds: number, totalSeconds: number) => void;
  currentTask: string;
}

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export function PomodoroTimer({ onSessionComplete, onTimerTick, currentTask }: PomodoroTimerProps) {
  const { t } = useLanguage();
  const { showNotification, requestPermission } = useNotification();
  const [mode, setMode] = useState<SessionType>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const totalSeconds = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
  const progress = 1 - secondsLeft / totalSeconds;

  useEffect(() => {
    onTimerTick(secondsLeft, totalSeconds);
  }, [secondsLeft, totalSeconds, onTimerTick]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      if (sessionStartTime) {
        const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        onSessionComplete(mode, duration);

        const notificationTitle = mode === 'focus'
          ? t('notification.focusComplete')
          : t('notification.breakComplete');
        const notificationBody = mode === 'focus'
          ? t('notification.timeForBreak')
          : t('notification.timeToFocus');

        showNotification(notificationTitle, {
          body: notificationBody,
          tag: 'pomodoro-session',
        });
      }

      const nextMode: SessionType = mode === 'focus' ? 'break' : 'focus';
      setMode(nextMode);
      setSecondsLeft(nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, mode, sessionStartTime, onSessionComplete]);

  const toggleTimer = useCallback(() => {
    if (!isActive) {
      setSessionStartTime(new Date());
    }
    setIsActive(!isActive);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSecondsLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    setSessionStartTime(null);
  }, [mode]);

  const switchMode = useCallback((newMode: SessionType) => {
    setMode(newMode);
    setSecondsLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    setIsActive(false);
    setSessionStartTime(null);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative z-10 flex flex-col items-center space-y-8">
      <div className="flex gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={mode === 'focus' ? 'default' : 'outline'}
            onClick={() => switchMode('focus')}
            disabled={isActive}
            className={`min-w-[140px] h-12 font-normal tracking-wide transition-all duration-300 rounded-full ${
              mode === 'focus'
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 shadow-lg shadow-orange-300/40 text-white'
                : 'border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700'
            }`}
          >
            <Brain className="w-4 h-4 mr-2" />
            {t('timer.focus')}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={mode === 'break' ? 'default' : 'outline'}
            onClick={() => switchMode('break')}
            disabled={isActive}
            className={`min-w-[140px] h-12 font-normal tracking-wide transition-all duration-300 rounded-full ${
              mode === 'break'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-300/40 text-white'
                : 'border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-700'
            }`}
          >
            <Coffee className="w-4 h-4 mr-2" />
            {t('timer.break')}
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-72 h-72 rounded-full blur-3xl opacity-30 ${
              mode === 'focus' ? 'bg-orange-300' : 'bg-emerald-300'
            }`}
          />
        </div>

        <svg className="w-72 h-72 -rotate-90 relative z-10" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={mode === 'focus' ? '#fb923c' : '#34d399'}
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor={mode === 'focus' ? '#f472b6' : '#2dd4bf'}
                stopOpacity="1"
              />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="85"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={mode === 'focus' ? 'text-orange-100' : 'text-emerald-100'}
          />
          <motion.circle
            cx="100"
            cy="100"
            r="85"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={534.07}
            initial={{ strokeDashoffset: 534.07 }}
            animate={{ strokeDashoffset: 534.07 * (1 - progress) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={secondsLeft}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-7xl font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500"
          >
            {formatTime(secondsLeft)}
          </motion.div>
          {currentTask && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-600 mt-3 font-medium max-w-[200px] text-center truncate"
            >
              {currentTask}
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="flex gap-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="lg"
            onClick={toggleTimer}
            className={`rounded-full w-20 h-20 shadow-lg transition-all duration-300 ${
              mode === 'focus'
                ? 'bg-gradient-to-br from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 shadow-orange-300/50 text-white'
                : 'bg-gradient-to-br from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-300/50 text-white'
            }`}
          >
            {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="lg"
            variant="outline"
            onClick={resetTimer}
            className="rounded-full w-20 h-20 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all duration-300 text-gray-700"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <div className="text-gray-600 font-medium text-sm tracking-wide">
          {mode === 'focus' ? t('timer.focusSession') : t('timer.breakTime')}
        </div>
        <div className="text-gray-500 text-xs font-normal">
          {isActive ? t('timer.inProgress') : t('timer.readyToStart')}
        </div>
      </div>
    </div>
  );
}
