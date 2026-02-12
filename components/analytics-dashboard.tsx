'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';
import { FocusAnalytics } from '@/lib/types';
import { useLanguage } from '@/lib/language-context';

interface AnalyticsDashboardProps {
  analytics: FocusAnalytics;
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  const { t } = useLanguage();

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const chartData = analytics.hourlyDistribution.map((item) => ({
    hour: `${item.hour}:00`,
    intensity: item.intensity,
    minutes: item.focusMinutes,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full max-w-4xl space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-wide text-gray-700">
              {t('analytics.totalFocusTime')}
            </CardTitle>
            <Clock className="h-5 w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500">
              {formatMinutes(analytics.totalFocusTime)}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-normal tracking-wide">
              {t('analytics.todayAccumulation')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-wide text-gray-700">
              {t('analytics.sessionsCompleted')}
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
              {analytics.sessionsCompleted}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-normal tracking-wide">
              {t('analytics.pomodoroCycles')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="font-medium tracking-wide text-gray-700">
            {t('analytics.focusIntensity')}
          </CardTitle>
          <CardDescription className="font-normal text-gray-500">
            {t('analytics.concentrationPattern')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f472b6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #f3e8ff',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: '#6b7280', fontWeight: 500 }}
                formatter={(value: number, name: string) => {
                  if (name === 'intensity') return [`${value}%`, t('analytics.intensity')];
                  return [formatMinutes(value), t('analytics.focusTime')];
                }}
              />
              <Area
                type="monotone"
                dataKey="intensity"
                stroke="#f472b6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIntensity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
