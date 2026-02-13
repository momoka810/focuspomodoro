'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, continueAsGuest } = useAuth();
  const { language } = useLanguage();

  const text = {
    ja: {
      signIn: 'ログイン',
      signUp: '新規登録',
      email: 'メールアドレス',
      password: 'パスワード',
      submit: isSignUp ? '登録' : 'ログイン',
      switchToSignUp: 'アカウントをお持ちでない方',
      switchToSignIn: 'アカウントをお持ちの方',
      switchButton: isSignUp ? 'ログインはこちら' : '新規登録はこちら',
      title: isSignUp ? '新規登録' : 'ログイン',
      description: isSignUp ? 'アカウントを作成してポモドーロを始めましょう' : 'アカウントにログインしてください',
      passwordMin: 'パスワードは6文字以上で入力してください',
      invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
      emailAlreadyExists: 'このメールアドレスは既に登録されています',
      networkError: 'ネットワークエラーが発生しました。環境変数とSupabaseの設定を確認してください。',
      continueAsGuest: 'ゲストとして続ける',
      guestNote: 'データはローカルに保存されます',
      or: 'または',
    },
    en: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      submit: isSignUp ? 'Sign Up' : 'Sign In',
      switchToSignUp: "Don't have an account?",
      switchToSignIn: 'Already have an account?',
      switchButton: isSignUp ? 'Sign In' : 'Sign Up',
      title: isSignUp ? 'Sign Up' : 'Sign In',
      description: isSignUp ? 'Create an account to start using Pomodoro' : 'Sign in to your account',
      passwordMin: 'Password must be at least 6 characters',
      invalidCredentials: 'Invalid email or password',
      emailAlreadyExists: 'Email already exists',
      networkError: 'Network error occurred. Please check your environment variables and Supabase configuration.',
      continueAsGuest: 'Continue as Guest',
      guestNote: 'Data will be saved locally',
      or: 'or',
    },
  };

  const t = text[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError(t.passwordMin);
      setLoading(false);
      return;
    }

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError(t.invalidCredentials);
        } else if (error.message.includes('already registered')) {
          setError(t.emailAlreadyExists);
        } else if (error.message.includes('fetch')) {
          setError(t.networkError);
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      setError(t.networkError);
      console.error('Auth error:', err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '...' : t.submit}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? t.switchToSignIn : t.switchToSignUp}{' '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {t.switchButton}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t.or}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={continueAsGuest}
              disabled={loading}
            >
              {t.continueAsGuest}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              {t.guestNote}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
