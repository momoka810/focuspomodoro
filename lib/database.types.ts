export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      daily_reflections: {
        Row: {
          id: string
          user_id: string
          reflection_text: string
          ai_feedback: string | null
          session_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reflection_text: string
          ai_feedback?: string | null
          session_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reflection_text?: string
          ai_feedback?: string | null
          session_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          id: string
          user_id: string
          goal_type: 'daily' | 'weekly' | 'monthly'
          target_sessions: number
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type: 'daily' | 'weekly' | 'monthly'
          target_sessions?: number
          start_date?: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: 'daily' | 'weekly' | 'monthly'
          target_sessions?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pomodoro_sessions: {
        Row: {
          id: string
          user_id: string
          session_type: 'work' | 'short_break' | 'long_break'
          duration_minutes: number
          completed_at: string
          task_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_type: 'work' | 'short_break' | 'long_break'
          duration_minutes?: number
          completed_at?: string
          task_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_type?: 'work' | 'short_break' | 'long_break'
          duration_minutes?: number
          completed_at?: string
          task_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string
          avatar_url: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string
          avatar_url?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
