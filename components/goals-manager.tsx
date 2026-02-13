'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface Goal {
  id: string;
  goal_type: 'daily' | 'weekly' | 'monthly';
  target_sessions: number;
  start_date: string;
  end_date: string;
  current_progress?: number;
}

export function GoalsManager() {
  const { language } = useLanguage();
  const { user, isGuest } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [localGoals, setLocalGoals] = useLocalStorage<Goal[]>('goals', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalType, setNewGoalType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newGoalTarget, setNewGoalTarget] = useState('8');

  const text = {
    ja: {
      title: '目標設定',
      addGoal: '目標を追加',
      goalType: '目標タイプ',
      daily: '日次',
      weekly: '週次',
      monthly: '月次',
      targetSessions: '目標セッション数',
      cancel: 'キャンセル',
      add: '追加',
      noGoals: '目標が設定されていません',
      progress: '進捗',
      sessions: 'セッション',
    },
    en: {
      title: 'Goals',
      addGoal: 'Add Goal',
      goalType: 'Goal Type',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      targetSessions: 'Target Sessions',
      cancel: 'Cancel',
      add: 'Add',
      noGoals: 'No goals set',
      progress: 'Progress',
      sessions: 'sessions',
    },
  };

  const t = text[language];

  useEffect(() => {
    if (isGuest) {
      setGoals(localGoals.map(goal => ({ ...goal, current_progress: 0 })));
      return;
    }

    if (!user) return;

    const loadGoals = async () => {
      const now = new Date();
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .gte('end_date', now.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (data) {
        const goalsWithProgress = await Promise.all(
          data.map(async (goal) => {
            const { data: sessions } = await supabase
              .from('pomodoro_sessions')
              .select('id')
              .eq('user_id', user.id)
              .eq('session_type', 'work')
              .gte('completed_at', goal.start_date)
              .lte('completed_at', goal.end_date);

            return {
              ...goal,
              current_progress: sessions?.length || 0,
            };
          })
        );

        setGoals(goalsWithProgress);
      }
    };

    loadGoals();
  }, [user, isGuest, localGoals]);

  const addGoal = async () => {
    if (!user) return;

    const targetSessions = parseInt(newGoalTarget);
    if (isNaN(targetSessions) || targetSessions <= 0) return;

    const now = new Date();
    let endDate = new Date();

    if (newGoalType === 'daily') {
      endDate.setDate(now.getDate() + 1);
    } else if (newGoalType === 'weekly') {
      endDate.setDate(now.getDate() + 7);
    } else {
      endDate.setMonth(now.getMonth() + 1);
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        goal_type: newGoalType,
        target_sessions: targetSessions,
        start_date: now.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      })
      .select()
      .single();

    if (data && !error) {
      setGoals([{ ...data, current_progress: 0 }, ...goals]);
      setNewGoalTarget('8');
      setIsAdding(false);
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (!error) {
      setGoals(goals.filter((goal) => goal.id !== goalId));
    }
  };

  const getGoalTypeLabel = (type: string) => {
    if (type === 'daily') return t.daily;
    if (type === 'weekly') return t.weekly;
    return t.monthly;
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Target className="w-6 h-6 text-orange-500" />
          {t.title}
        </h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addGoal}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">{t.goalType}</label>
                <Select value={newGoalType} onValueChange={(value: any) => setNewGoalType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t.daily}</SelectItem>
                    <SelectItem value="weekly">{t.weekly}</SelectItem>
                    <SelectItem value="monthly">{t.monthly}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">{t.targetSessions}</label>
                <Input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addGoal} size="sm" className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                {t.add}
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewGoalTarget('8');
                }}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                {t.cancel}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence>
          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-400"
            >
              {t.noGoals}
            </motion.div>
          ) : (
            goals.map((goal) => {
              const progress = goal.current_progress || 0;
              const target = goal.target_sessions;
              const percentage = Math.min((progress / target) * 100, 100);
              const isCompleted = progress >= target;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 rounded-lg border-2 ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-orange-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {getGoalTypeLabel(goal.goal_type)}
                        </span>
                        {isCompleted && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            {t.progress} 100%
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {progress} / {target} {t.sessions}
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteGoal(goal.id)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                          : 'bg-gradient-to-r from-orange-400 to-pink-400'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
