
"use client";

import type { Habit } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Activity } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface DailyHabit extends Habit {
  isCompleted: boolean;
}

interface DailyHabitStatusProps {
  habitsForDay: DailyHabit[];
  selectedDate: Date;
}

const DynamicIcon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] || Activity;
  return <IconComponent {...props} />;
};

export default function DailyHabitStatus({ habitsForDay, selectedDate }: DailyHabitStatusProps) {
  if (!habitsForDay || habitsForDay.length === 0) {
    return (
       <Alert className="mt-4">
        <Info className="h-4 w-4" />
        <AlertTitle>No Active Habits</AlertTitle>
        <AlertDescription>
          There were no habits scheduled or active on {format(selectedDate, "PPP")}.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <h3 className="text-lg font-medium">
        Habit Status for {format(selectedDate, "PPP")}
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {habitsForDay.map(habit => (
          <Card key={habit.id} className={`border-l-4 ${habit.isCompleted ? 'border-green-500' : 'border-red-500'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <DynamicIcon name={habit.icon} className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base font-medium">{habit.name}</CardTitle>
              </div>
              {habit.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <p className={`text-xs ${habit.isCompleted ? 'text-green-600' : 'text-red-600'}`}>
                {habit.isCompleted ? 'Completed' : 'Not Completed'} - {habit.points} points
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
