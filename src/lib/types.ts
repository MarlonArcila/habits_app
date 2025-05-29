export interface Habit {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  createdAt: string; // ISO date string
  points: number; // Points for completing this habit once
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface StoredData {
  habits: Habit[];
  habitLogs: HabitLog[];
}
