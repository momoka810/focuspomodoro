export type SessionType = 'focus' | 'break';

export interface PomodoroSession {
  id: string;
  taskName: string;
  type: SessionType;
  startTime: Date;
  endTime?: Date;
  duration: number;
}

export interface FocusAnalytics {
  totalFocusTime: number;
  sessionsCompleted: number;
  hourlyDistribution: {
    hour: number;
    focusMinutes: number;
    intensity: number;
  }[];
}
