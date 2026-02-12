'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export function TaskList() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const text = {
    ja: {
      title: 'タスク管理',
      addTask: 'タスクを追加',
      newTask: '新しいタスク',
      cancel: 'キャンセル',
      add: '追加',
      noTasks: 'タスクはありません',
      completed: '完了',
    },
    en: {
      title: 'Task Management',
      addTask: 'Add Task',
      newTask: 'New Task',
      cancel: 'Cancel',
      add: 'Add',
      noTasks: 'No tasks',
      completed: 'Completed',
    },
  };

  const t = text[language];

  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setTasks(data);
      }
    };

    loadTasks();
  }, [user]);

  const addTask = async () => {
    if (!newTaskTitle.trim() || !user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: newTaskTitle.trim(),
        completed: false,
      })
      .select()
      .single();

    if (data && !error) {
      setTasks([data, ...tasks]);
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({
        completed: !completed,
        completed_at: !completed ? new Date().toISOString() : null,
      })
      .eq('id', taskId);

    if (!error) {
      setTasks(tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !completed } : task
      ));
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (!error) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">{t.title}</h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addTask}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="flex gap-2">
              <Input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={t.newTask}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                  if (e.key === 'Escape') {
                    setIsAdding(false);
                    setNewTaskTitle('');
                  }
                }}
                autoFocus
              />
              <Button onClick={addTask} size="sm">
                <Check className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskTitle('');
                }}
                size="sm"
                variant="outline"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-400"
            >
              {t.noTasks}
            </motion.div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  task.completed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-orange-100 hover:border-orange-200'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <span
                  className={`flex-1 ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {task.title}
                </span>
                <Button
                  onClick={() => deleteTask(task.id)}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
