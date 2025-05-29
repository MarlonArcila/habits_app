"use client";

import type { Habit } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  currentStreak: number;
  onToggleCompletion: () => void;
}

const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] || LucideIcons.Activity;
  return <IconComponent {...props} />;
};

export function HabitCard({ habit, isCompletedToday, currentStreak, onToggleCompletion }: HabitCardProps) {
  const cardId = `habit-${habit.id}`;
  return (
    <Card className={cn("transition-all duration-300 ease-in-out shadow-md hover:shadow-lg", isCompletedToday ? "bg-primary/10 border-primary/50" : "bg-card")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <DynamicIcon name={habit.icon} className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={cardId}
            checked={isCompletedToday}
            onCheckedChange={onToggleCompletion}
            aria-label={`Mark ${habit.name} as completed`}
          />
          <Label htmlFor={cardId} className="text-sm cursor-pointer select-none">
            Done Today
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <p>Points: <span className="font-semibold text-primary">{habit.points}</span></p>
          <p>Streak: <span className="font-semibold text-accent">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
