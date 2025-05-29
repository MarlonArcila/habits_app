"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
}

export function PointsDisplay({ points }: PointsDisplayProps) {
  return (
    <Card className="shadow-lg bg-gradient-to-r from-primary to-blue-500 text-primary-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl sm:text-2xl font-bold">Total Points</CardTitle>
        <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl sm:text-4xl font-extrabold">{points}</div>
        <p className="text-xs text-primary-foreground/80 mt-1">
          Keep up the great work! Every habit counts.
        </p>
      </CardContent>
    </Card>
  );
}
