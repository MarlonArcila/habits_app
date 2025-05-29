
"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useHabits } from '@/hooks/useHabits';
import { AppHeader } from '@/components/AppHeader';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { HabitList } from '@/components/HabitList';
import { PointsDisplay } from '@/components/PointsDisplay';
import { PersonalizedTipsCard } from '@/components/PersonalizedTipsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium">Loading your habits...</p>
      <div className="w-full max-w-md mt-8 space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export default function HabitualPage() {
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitCompletion,
    calculateStreak,
    totalPoints,
    getAIInputData,
    isLoading: isHabitsLoading,
  } = useHabits();

  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false);
  const [todayString, setTodayString] = useState('');

  useEffect(() => {
    setTodayString(format(new Date(), 'yyyy-MM-dd'));
  }, []);


  if (isHabitsLoading || !todayString) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader onAddHabitClick={() => setIsAddHabitDialogOpen(true)} />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <PointsDisplay points={totalPoints} />
        
        <HabitList
          habits={habits}
          today={todayString}
          getHabitCompletion={getHabitCompletion}
          toggleHabitCompletion={toggleHabitCompletion}
          calculateStreak={calculateStreak}
          deleteHabit={deleteHabit}
        />
        
        <PersonalizedTipsCard getAIInputData={getAIInputData} />
      </main>
      <AddHabitDialog
        isOpen={isAddHabitDialogOpen}
        onClose={() => setIsAddHabitDialogOpen(false)}
        onAddHabit={(name, icon, points) => addHabit(name, icon, points)}
      />
    </div>
  );
}
