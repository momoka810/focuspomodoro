'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/language-context';

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskInput({ value, onChange }: TaskInputProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="w-full max-w-md space-y-3"
    >
      <Label htmlFor="task" className="text-gray-600 font-medium tracking-wide text-xs">
        {t('task.label')}
      </Label>
      <Input
        id="task"
        type="text"
        placeholder={t('task.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 focus:border-purple-300 text-gray-700 placeholder:text-gray-400 font-normal tracking-wide h-12 transition-all duration-300 rounded-xl shadow-sm"
      />
    </motion.div>
  );
}
