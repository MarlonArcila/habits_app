
"use client";

import type { Habit } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as LucideIcons from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  currentStreak: number;
  onToggleCompletion: () => void;
  onDeleteHabit: (habitId: string) => void;
}

const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] || LucideIcons.Activity;
  return <IconComponent {...props} />;
};

export function HabitCard({ habit, isCompletedToday, currentStreak, onToggleCompletion, onDeleteHabit }: HabitCardProps) {
  const cardId = `habit-${habit.id}`;
  return (
    <Card className={cn("transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex flex-col", isCompletedToday ? "bg-primary/10 border-primary/50" : "bg-card")}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
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
            Done
          </Label>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <p>Points: <span className="font-semibold text-primary">{habit.points}</span></p>
          <p>Streak: <span className="font-semibold text-accent">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span></p>
        </div>
      </CardContent>
      <div className="p-4 pt-0 mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the habit "{habit.name}" and all its associated tracking data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteHabit(habit.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
