
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

// For chart components
export interface ChartData {
  name: string; // Typically X-axis category (e.g., day, month name)
  value: number; // Typically Y-axis value (e.g., percentage, count)
  [key: string]: any; // Allow other properties if needed for multi-line/bar charts
}

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> } // Adjusted theme type
  );
};
