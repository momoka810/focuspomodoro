'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.title': 'Focus',
    'app.subtitle': 'Where time becomes art, and focus flows',
    'app.footer': 'Built with intention and care',
    'timer.focus': 'Focus',
    'timer.break': 'Break',
    'timer.focusSession': 'Focus Session',
    'timer.breakTime': 'Break Time',
    'timer.inProgress': 'In Progress',
    'timer.readyToStart': 'Ready to Start',
    'task.label': 'Current Task',
    'task.placeholder': 'What are you working on?',
    'task.untitled': 'Untitled Task',
    'analytics.totalFocusTime': 'Total Focus Time',
    'analytics.todayAccumulation': "Today's accumulation",
    'analytics.sessionsCompleted': 'Sessions Completed',
    'analytics.pomodoroCycles': 'Pomodoro cycles',
    'analytics.focusIntensity': 'Focus Intensity',
    'analytics.concentrationPattern': 'Your concentration pattern throughout the day',
    'analytics.intensity': 'Intensity',
    'analytics.focusTime': 'Focus Time',
    'social.peopleFocusing': 'people focusing now',
    'notification.focusComplete': 'Focus Session Complete!',
    'notification.breakComplete': 'Break Time Over!',
    'notification.timeForBreak': 'Great work! Time for a break.',
    'notification.timeToFocus': 'Break is over. Ready to focus again?',
    'reflection.title': 'What did you accomplish today?',
    'reflection.description': 'Share what you worked hard on today and get positive feedback from AI.',
    'reflection.placeholder': 'Write about what you accomplished today...',
    'reflection.yourReflection': 'Your Reflection',
    'reflection.aiFeedback': 'AI Feedback',
    'reflection.getFeedback': 'Get AI Feedback',
    'reflection.generating': 'Generating...',
    'calendar.title': 'Reflection Calendar',
    'calendar.description': 'View your daily reflections and progress',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.skip': 'Skip',
    'common.saving': 'Saving...',
  },
  ja: {
    'app.title': 'フォーカス',
    'app.subtitle': '時を芸術に、集中を流れに',
    'app.footer': '意図と配慮をもって構築',
    'timer.focus': '集中',
    'timer.break': '休憩',
    'timer.focusSession': '集中セッション',
    'timer.breakTime': '休憩時間',
    'timer.inProgress': '実行中',
    'timer.readyToStart': '開始準備完了',
    'task.label': '現在のタスク',
    'task.placeholder': '何に取り組んでいますか？',
    'task.untitled': '無題のタスク',
    'analytics.totalFocusTime': '合計集中時間',
    'analytics.todayAccumulation': '本日の累積',
    'analytics.sessionsCompleted': '完了セッション',
    'analytics.pomodoroCycles': 'ポモドーロサイクル',
    'analytics.focusIntensity': '集中度',
    'analytics.concentrationPattern': '一日を通しての集中パターン',
    'analytics.intensity': '集中度',
    'analytics.focusTime': '集中時間',
    'social.peopleFocusing': '人が集中中',
    'notification.focusComplete': '集中セッション完了！',
    'notification.breakComplete': '休憩終了！',
    'notification.timeForBreak': '素晴らしい！休憩しましょう。',
    'notification.timeToFocus': '休憩終了。集中する準備はできましたか？',
    'reflection.title': '今日頑張ったことは？',
    'reflection.description': '今日頑張ったことを共有して、AIからポジティブなフィードバックをもらいましょう。',
    'reflection.placeholder': '今日取り組んだことを書いてください...',
    'reflection.yourReflection': 'あなたの振り返り',
    'reflection.aiFeedback': 'AIフィードバック',
    'reflection.getFeedback': 'AIフィードバックを取得',
    'reflection.generating': '生成中...',
    'calendar.title': '振り返りカレンダー',
    'calendar.description': '日々の振り返りと進捗を確認',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.skip': 'スキップ',
    'common.saving': '保存中...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
