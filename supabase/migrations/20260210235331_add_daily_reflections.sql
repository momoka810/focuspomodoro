/*
  # Add Daily Reflections Table

  1. New Tables
    - `daily_reflections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `reflection_text` (text) - ユーザーが入力した「今日頑張ったこと」
      - `ai_feedback` (text) - Dify AIからのフィードバック
      - `session_date` (date) - 反映の日付
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `daily_reflections` table
    - Add policies for authenticated users to manage their own reflections
*/

CREATE TABLE IF NOT EXISTS daily_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reflection_text text NOT NULL,
  ai_feedback text,
  session_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reflections"
  ON daily_reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON daily_reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON daily_reflections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON daily_reflections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date 
  ON daily_reflections(user_id, session_date DESC);