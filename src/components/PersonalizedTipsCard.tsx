"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { personalizedHabitTips, PersonalizedHabitTipsOutput } from '@/ai/flows/personalized-habit-tips';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface PersonalizedTipsCardProps {
  getAIInputData: () => string;
}

export function PersonalizedTipsCard({ getAIInputData }: PersonalizedTipsCardProps) {
  const [tips, setTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTips = async () => {
    setIsLoading(true);
    setError(null);
    setTips(null); 
    try {
      const habitData = getAIInputData();
      if (!habitData || JSON.parse(habitData).habits.length === 0) {
         toast({
          title: "No Habits to Analyze",
          description: "Add and track some habits before requesting tips.",
          variant: "default",
        });
        setIsLoading(false);
        return;
      }
      const result: PersonalizedHabitTipsOutput = await personalizedHabitTips({ habitData });
      setTips(result.tips);
      toast({
        title: "Tips Generated!",
        description: "Your personalized habit tips are ready.",
      });
    } catch (err) {
      console.error("Failed to fetch tips:", err);
      setError("Could not generate tips at this time. Please try again later.");
       toast({
        title: "Error Generating Tips",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debounce fetchTips or manage calls carefully if getAIInputData changes frequently
  // For now, it's manually triggered by button click.

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <CardTitle>Personalized AI Tips</CardTitle>
          </div>
          <Button onClick={fetchTips} disabled={isLoading} size="sm" variant="outline">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Get Tips'
            )}
          </Button>
        </div>
        <CardDescription>
          Receive AI-powered suggestions to improve your habit consistency based on your progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !tips && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {tips && !isLoading && (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {tips.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
        {!isLoading && !tips && !error && (
          <p className="text-sm text-muted-foreground">Click "Get Tips" to see your personalized advice.</p>
        )}
      </CardContent>
    </Card>
  );
}
