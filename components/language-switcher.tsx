'use client';

import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 font-medium transition-all duration-300 rounded-full text-gray-700 shadow-sm"
      >
        <Languages className="w-4 h-4" />
        <span className="text-xs font-medium tracking-wider">{language === 'en' ? 'JP' : 'EN'}</span>
      </Button>
    </motion.div>
  );
}
