# 🍅 Focus Pomodoro

ポモドーロテクニックを活用した、モダンなタスク管理・生産性向上アプリケーションです。

## ✨ 主な機能

### 📋 タスク管理
- タスクの作成・編集・削除
- 完了/未完了の切り替え
- リアルタイム同期

### ⏱️ ポモドーロタイマー
- カスタマイズ可能な作業時間・休憩時間
- 自動セッション切り替え
- デスクトップ通知

### 🎯 目標設定
- 日次・週次・月次の目標管理
- 進捗トラッキング
- 達成率の可視化

### 📅 振り返りカレンダー
- 日々の作業記録
- カレンダービューで進捗確認
- 完了セッション数の表示

### 🤖 AI振り返りフィードバック
- セッション完了後のAIフィードバック
- 生産性向上のアドバイス
- パーソナライズされた提案

### 📊 統計・分析
- 時系列での作業時間分析
- カテゴリ別統計
- 週次・月次レポート

### 🌐 多言語対応
- 日本語・英語切り替え
- ユーザー設定の保存

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 13, React 18, TypeScript
- **スタイリング**: Tailwind CSS, shadcn/ui
- **認証**: Supabase Auth
- **データベース**: Supabase (PostgreSQL)
- **アニメーション**: Framer Motion
- **アイコン**: Lucide React
- **チャート**: Recharts

## 🚀 セットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd focus-pomodoro
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定

`.env`ファイルを作成し、以下を設定：
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 開発サーバーを起動
```bash
npm run dev
```

5. ブラウザで開く
```
http://localhost:3000
```

## 📦 ビルド

本番環境用にビルド：
```bash
npm run build
npm start
```

## 🗄️ データベーススキーマ

Supabaseマイグレーションは`supabase/migrations/`に配置されています。

主なテーブル：
- `tasks` - タスク情報
- `pomodoro_sessions` - ポモドーロセッション記録
- `goals` - 目標設定
- `daily_reflections` - 日次振り返り

## 🎨 デザイン

- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- ダークモード対応
- アクセシビリティ重視
- モダンで洗練されたUI

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

---

**生産性を向上させ、目標を達成しましょう！** 🚀
