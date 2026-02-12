'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function SocialCounter() {
  const { t } = useLanguage();
  const [count, setCount] = useState(324);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const change = Math.floor(Math.random() * 11) - 5;
        const newCount = prev + change;
        return Math.max(300, Math.min(500, newCount));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-lg"
    >
      <Users className="w-4 h-4 text-pink-500" />
      <div className="flex items-baseline gap-1.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-semibold text-gray-700"
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-gray-600 font-normal">
          {t('social.peopleFocusing')}
        </span>
      </div>
    </motion.div>
  );
}
