'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/lib/language-context';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function ReflectionDialog({ open, onOpenChange, userId }: ReflectionDialogProps) {
  const { t } = useLanguage();
  const [reflectionText, setReflectionText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleGetFeedback = async () => {
    if (!reflectionText.trim()) return;

    setIsLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-ai-feedback`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reflectionText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI feedback');
      }

      const data = await response.json();
      setAiFeedback(data.feedback);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      setAiFeedback('素晴らしい努力ですね！その調子で頑張りましょう！');
      setShowFeedback(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await supabase.from('daily_reflections').insert({
        user_id: userId,
        reflection_text: reflectionText,
        ai_feedback: aiFeedback,
        session_date: new Date().toISOString().split('T')[0],
      });

      setReflectionText('');
      setAiFeedback('');
      setShowFeedback(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving reflection:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setReflectionText('');
    setAiFeedback('');
    setShowFeedback(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            {t('reflection.title')}
          </DialogTitle>
          <DialogDescription>
            {t('reflection.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!showFeedback ? (
            <>
              <Textarea
                placeholder={t('reflection.placeholder')}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleGetFeedback}
                disabled={!reflectionText.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('reflection.generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('reflection.getFeedback')}
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  {t('reflection.yourReflection')}
                </p>
                <p className="text-gray-800">{reflectionText}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 mb-2 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('reflection.aiFeedback')}
                </p>
                <p className="text-gray-800 leading-relaxed">{aiFeedback}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {showFeedback ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : (
                  t('common.save')
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              {t('common.skip')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
