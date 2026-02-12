import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          avatar_url?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pomodoro_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: 'work' | 'short_break' | 'long_break';
          duration_minutes: number;
          completed_at: string;
          task_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: 'work' | 'short_break' | 'long_break';
          duration_minutes: number;
          completed_at?: string;
          task_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: 'work' | 'short_break' | 'long_break';
          duration_minutes?: number;
          completed_at?: string;
          task_id?: string | null;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          goal_type: 'daily' | 'weekly' | 'monthly';
          target_sessions: number;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_type: 'daily' | 'weekly' | 'monthly';
          target_sessions?: number;
          start_date?: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_type?: 'daily' | 'weekly' | 'monthly';
          target_sessions?: number;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
