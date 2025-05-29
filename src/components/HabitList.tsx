"use client";

import type { Habit } from '@/lib/types';
import { HabitCard } from './HabitCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Smile } from "lucide-react";

interface HabitListProps {
  habits: Habit[];
  today: string; // YYYY-MM-DD
  getHabitCompletion: (habitId: string, date: string) => boolean;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  calculateStreak: (habitId: string, todayString: string) => number;
}

export function HabitList({
  habits,
  today,
  getHabitCompletion,
  toggleHabitCompletion,
  calculateStreak,
}: HabitListProps) {
  if (!habits || habits.length === 0) {
    return (
      <Alert className="mt-4">
        <Smile className="h-4 w-4" />
        <AlertTitle>No Habits Yet!</AlertTitle>
        <AlertDescription>
          Click "Add Habit" to start tracking your goals.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Your Habits</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            isCompletedToday={getHabitCompletion(habit.id, today)}
            currentStreak={calculateStreak(habit.id, today)}
            onToggleCompletion={() => toggleHabitCompletion(habit.id, today)}
          />
        ))}
      </div>
    </div>
  );
}
