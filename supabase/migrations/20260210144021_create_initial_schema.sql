/*
  # 初期スキーマ作成

  ## 新しいテーブル
  
  ### profiles
  ユーザープロファイル情報を管理
  - `id` (uuid, primary key) - auth.users.idと連携
  - `email` (text) - ユーザーのメールアドレス
  - `display_name` (text) - 表示名
  - `avatar_url` (text) - アバター画像URL
  - `language` (text) - 言語設定（ja/en）
  - `created_at` (timestamptz) - 作成日時
  - `updated_at` (timestamptz) - 更新日時

  ### pomodoro_sessions
  ポモドーロセッションの履歴を記録
  - `id` (uuid, primary key) - セッションID
  - `user_id` (uuid, foreign key) - ユーザーID
  - `session_type` (text) - セッションタイプ（work/short_break/long_break）
  - `duration_minutes` (integer) - セッション時間（分）
  - `completed_at` (timestamptz) - 完了日時
  - `task_id` (uuid, foreign key, nullable) - 関連タスクID
  - `created_at` (timestamptz) - 作成日時

  ### tasks
  タスク管理
  - `id` (uuid, primary key) - タスクID
  - `user_id` (uuid, foreign key) - ユーザーID
  - `title` (text) - タスク名
  - `description` (text, nullable) - タスク説明
  - `completed` (boolean) - 完了フラグ
  - `completed_at` (timestamptz, nullable) - 完了日時
  - `created_at` (timestamptz) - 作成日時
  - `updated_at` (timestamptz) - 更新日時

  ### goals
  目標設定
  - `id` (uuid, primary key) - 目標ID
  - `user_id` (uuid, foreign key) - ユーザーID
  - `goal_type` (text) - 目標タイプ（daily/weekly/monthly）
  - `target_sessions` (integer) - 目標セッション数
  - `start_date` (date) - 開始日
  - `end_date` (date) - 終了日
  - `created_at` (timestamptz) - 作成日時
  - `updated_at` (timestamptz) - 更新日時

  ## セキュリティ
  
  すべてのテーブルでRLSを有効化し、以下のポリシーを設定：
  - ユーザーは自分のデータのみ閲覧可能
  - ユーザーは自分のデータのみ作成・更新・削除可能
*/

-- profiles テーブル
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text DEFAULT '',
  avatar_url text DEFAULT '',
  language text DEFAULT 'ja',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- pomodoro_sessions テーブル
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('work', 'short_break', 'long_break')),
  duration_minutes integer NOT NULL DEFAULT 25,
  completed_at timestamptz DEFAULT now(),
  task_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON pomodoro_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON pomodoro_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON pomodoro_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON pomodoro_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- tasks テーブル
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- goals テーブル
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type text NOT NULL CHECK (goal_type IN ('daily', 'weekly', 'monthly')),
  target_sessions integer NOT NULL DEFAULT 8,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 外部キー制約を追加
ALTER TABLE pomodoro_sessions
  ADD CONSTRAINT fk_task
  FOREIGN KEY (task_id)
  REFERENCES tasks(id)
  ON DELETE SET NULL;

-- インデックスを作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_completed_at ON pomodoro_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);