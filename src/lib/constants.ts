import type { Habit } from './types';

export const DEFAULT_HABITS: Omit<Habit, 'id' | 'createdAt'>[] = [
  { name: 'Exercise', icon: 'Dumbbell', points: 10 },
  { name: 'Read', icon: 'BookOpen', points: 10 },
  { name: 'Meditate', icon: 'Brain', points: 5 },
  { name: 'Drink Water (8 glasses)', icon: 'GlassWater', points: 5 },
  { name: 'Wake up early', icon: 'Sunrise', points: 10 },
];

export const POINTS_PER_COMPLETION = 10;
