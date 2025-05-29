
// @ts-nocheck
// remove-ts-nocheck
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Habit, HabitLog, StoredData } from '@/lib/types';
import { DEFAULT_HABITS, POINTS_PER_COMPLETION } from '@/lib/constants';
import { format, subDays, parseISO, differenceInCalendarDays, startOfDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'habitualData';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData: StoredData = JSON.parse(storedData);
          setHabits(parsedData.habits || []);
          setHabitLogs(parsedData.habitLogs || []);
        } else {
          // Initialize with default habits if no data is stored
          const initializedHabits = DEFAULT_HABITS.map(habit => ({
            ...habit,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
          }));
          setHabits(initializedHabits);
          setHabitLogs([]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits: initializedHabits, habitLogs: [] }));
        }
      } catch (error) {
        console.error("Failed to load data from localStorage", error);
        // Fallback to default if parsing fails
        const initializedHabits = DEFAULT_HABITS.map(habit => ({
            ...habit,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
          }));
        setHabits(initializedHabits);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      try {
        const dataToStore: StoredData = { habits, habitLogs };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        
        // Recalculate total points
        const points = habitLogs.reduce((acc, log) => {
          if (log.completed) {
            const habit = habits.find(h => h.id === log.habitId);
            return acc + (habit?.points || POINTS_PER_COMPLETION);
          }
          return acc;
        }, 0);
        setTotalPoints(points);

      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [habits, habitLogs, isLoading]);

  const addHabit = useCallback((name: string, icon: string, points: number) => {
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      icon,
      points: points || POINTS_PER_COMPLETION,
      createdAt: new Date().toISOString(),
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);
    if (!habitToDelete) return;

    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    setHabitLogs(prevLogs => prevLogs.filter(log => log.habitId !== habitId));
    toast({
      title: "Habit Deleted",
      description: `"${habitToDelete.name}" and all its logs have been removed.`,
    });
  }, [habits, toast]);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => { // date is YYYY-MM-DD
    setHabitLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.habitId === habitId && log.date === date);
      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = {
          ...updatedLogs[existingLogIndex],
          completed: !updatedLogs[existingLogIndex].completed,
        };
        return updatedLogs;
      } else {
        return [...prevLogs, { habitId, date, completed: true }];
      }
    });
  }, []);

  const getHabitCompletion = useCallback((habitId: string, date: string): boolean => {
    const log = habitLogs.find(log => log.habitId === habitId && log.date === date);
    return log?.completed || false;
  }, [habitLogs]);

  const calculateStreak = useCallback((habitId: string, todayString: string): number => {
    let streak = 0;
    let dateToVerify = parseISO(todayString);
    
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const dateStr = format(dateToVerify, 'yyyy-MM-dd');
      if (getHabitCompletion(habitId, dateStr)) {
        streak++;
        dateToVerify = subDays(dateToVerify, 1);
      } else {
        if (dateStr === todayString) { 
             streak = 0; 
             dateToVerify = subDays(parseISO(todayString), 1);
             // eslint-disable-next-line no-constant-condition
             while(true) {
                const prevDateStr = format(dateToVerify, 'yyyy-MM-dd');
                if(getHabitCompletion(habitId, prevDateStr)) {
                    streak++;
                    dateToVerify = subDays(dateToVerify, 1);
                } else {
                    break;
                }
             }
        }
        break;
      }
    }
    return streak;

  }, [habitLogs, getHabitCompletion]);

  const getAIInputData = useCallback((): string => {
    const data = {
      habits: habits.map(h => ({ id: h.id, name: h.name, createdAt: h.createdAt, points: h.points })),
      logs: habitLogs.filter(log => {
        const logDate = parseISO(log.date);
        return differenceInCalendarDays(new Date(), logDate) <= 30;
      }),
      goals: [], 
    };
    return JSON.stringify(data);
  }, [habits, habitLogs]);

  return {
    habits,
    habitLogs,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitCompletion,
    calculateStreak,
    totalPoints,
    getAIInputData,
    isLoading,
  };
}
