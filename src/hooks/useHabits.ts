// @ts-nocheck
// remove-ts-nocheck
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Habit, HabitLog, StoredData } from '@/lib/types';
import { DEFAULT_HABITS, POINTS_PER_COMPLETION } from '@/lib/constants';
import { format, subDays, parseISO, differenceInCalendarDays, startOfDay } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const STORAGE_KEY = 'habitualData';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

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
    let currentStreak = 0;
    let currentDate = parseISO(todayString); // todayString should be YYYY-MM-DD

    const relevantLogs = habitLogs
      .filter(log => log.habitId === habitId && log.completed)
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()); // Sort by date descending

    if (relevantLogs.length === 0) return 0;

    // Check if today is completed
    const todayCompletedLog = relevantLogs.find(log => log.date === format(currentDate, 'yyyy-MM-dd'));
    if (todayCompletedLog) {
        currentStreak = 1;
        currentDate = subDays(currentDate, 1);
    } else {
      // If today is not completed, streak must end yesterday. So, start checking from yesterday.
      currentDate = subDays(currentDate, 1);
    }
    
    // Check previous days
    for (const log of relevantLogs) {
        const logDate = parseISO(log.date);
        if (differenceInCalendarDays(startOfDay(currentDate), startOfDay(logDate)) === 0) {
            currentStreak = (todayCompletedLog || log.date !== format(parseISO(todayString), 'yyyy-MM-dd')) ? currentStreak + 1 : currentStreak;
            currentDate = subDays(currentDate, 1);
        } else if (startOfDay(logDate) < startOfDay(currentDate)) {
            // A day was missed if logDate is before currentDate and not consecutive
            break; 
        }
    }
    // If today was not completed, and streak was calculated based on yesterday, it's already correct.
    // If today was completed, we initialized streak to 1 and added previous days.
    // The logic for incrementing streak when today is not completed needs adjustment.
    // Let's simplify: count consecutive days ending today (if completed) or yesterday.

    // Simpler streak calculation:
    let streak = 0;
    let dateToVerify = parseISO(todayString);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const dateStr = format(dateToVerify, 'yyyy-MM-dd');
      if (getHabitCompletion(habitId, dateStr)) {
        streak++;
        dateToVerify = subDays(dateToVerify, 1);
      } else {
        // If today is not completed, the streak is 0 unless we want to show streak ending yesterday.
        // For simplicity, if today is not complete, streak is 0 for "current streak".
        // If we want "longest current streak", then this logic changes.
        // This implementation counts consecutive days backwards from today.
        // If today is not complete, streak is 0 for today.
        if (dateStr === todayString) { // if today itself is not completed, current streak is 0
             // However, if user wants to see streak *up to* yesterday, we check logs for *yesterday*
             // For this requirement, "current streak" usually means "if I complete today, what will it be OR what was it yesterday"
             // Let's do: "number of consecutive past days + today (if completed)"
             // If today is not completed, we should calculate the streak ending yesterday.

             // If today is NOT completed, calculate streak ending yesterday
             streak = 0; // Reset
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
        // Include logs from the last 30 days for relevance
        const logDate = parseISO(log.date);
        return differenceInCalendarDays(new Date(), logDate) <= 30;
      }),
      // Goals can be added here in the future
      goals: [], 
    };
    return JSON.stringify(data);
  }, [habits, habitLogs]);

  return {
    habits,
    habitLogs,
    addHabit,
    toggleHabitCompletion,
    getHabitCompletion,
    calculateStreak,
    totalPoints,
    getAIInputData,
    isLoading,
  };
}
