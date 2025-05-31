
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useHabits } from '@/hooks/useHabits';
import type { Habit, HabitLog, ChartData } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MonthlyPerformanceChart from '@/components/dashboard/MonthlyPerformanceChart';
import YearlyPerformanceChart from '@/components/dashboard/YearlyPerformanceChart';
import DailyHabitStatus from '@/components/dashboard/DailyHabitStatus';
import { format, getDaysInMonth, getMonth, getYear, setMonth, setYear, startOfMonth, parseISO, isBefore, isEqual, startOfDay, endOfMonth } from 'date-fns';
import { CalendarIcon, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString());
const months = Array.from({ length: 12 }, (_, i) => ({ value: i.toString(), label: format(new Date(0, i), 'MMMM') }));

export default function DashboardPage() {
  const { habits, habitLogs, isLoading, getHabitCompletion } = useHabits();
  
  const [selectedTab, setSelectedTab] = useState<string>("monthly");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState<number>(getYear(new Date()));
  const [selectedYearForYearly, setSelectedYearForYearly] = useState<number>(getYear(new Date()));

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const monthlyChartData = useMemo((): ChartData[] => {
    if (isLoading || habits.length === 0 || !isClient) return [];

    const targetMonthDate = startOfMonth(setYear(setMonth(new Date(), selectedMonth), selectedYear));
    const daysInSelectedMonth = getDaysInMonth(targetMonthDate);
    const data: ChartData[] = [];

    for (let day = 1; day <= daysInSelectedMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      const currentDateStr = format(currentDate, 'yyyy-MM-dd');
      
      const trackableHabits = habits.filter(habit => {
        const habitCreationDate = startOfDay(parseISO(habit.createdAt));
        return isEqual(habitCreationDate, startOfDay(currentDate)) || isBefore(habitCreationDate, startOfDay(currentDate));
      });

      if (trackableHabits.length === 0) {
        data.push({ name: day.toString(), value: 0 });
        continue;
      }
      
      const completedCount = trackableHabits.filter(habit => {
        return habitLogs.some(log => log.habitId === habit.id && log.date === currentDateStr && log.completed);
      }).length;
      
      const completionPercentage = (completedCount / trackableHabits.length) * 100;
      data.push({ name: day.toString(), value: Math.round(completionPercentage) });
    }
    return data;
  }, [habits, habitLogs, selectedMonth, selectedYear, isLoading, isClient]);

  const yearlyChartData = useMemo((): ChartData[] => {
    if (isLoading || habits.length === 0 || !isClient) return [];
    const data: ChartData[] = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthDate = startOfMonth(new Date(selectedYearForYearly, monthIndex));
      const monthName = format(monthDate, 'MMM');
      const daysInMonth = getDaysInMonth(monthDate);
      
      let totalTrackableHabitDaysInMonth = 0;
      let totalCompletedHabitDaysInMonth = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(selectedYearForYearly, monthIndex, day);
        const currentDateStr = format(currentDate, 'yyyy-MM-dd');

        const trackableHabitsForDay = habits.filter(habit => {
          const habitCreationDate = startOfDay(parseISO(habit.createdAt));
          return isEqual(habitCreationDate, startOfDay(currentDate)) || isBefore(habitCreationDate, startOfDay(currentDate));
        });

        if (trackableHabitsForDay.length > 0) {
          totalTrackableHabitDaysInMonth += trackableHabitsForDay.length;
          const completedCountForDay = trackableHabitsForDay.filter(habit => 
            habitLogs.some(log => log.habitId === habit.id && log.date === currentDateStr && log.completed)
          ).length;
          totalCompletedHabitDaysInMonth += completedCountForDay;
        }
      }
      
      const averageCompletionPercentage = totalTrackableHabitDaysInMonth > 0 
        ? Math.round((totalCompletedHabitDaysInMonth / totalTrackableHabitDaysInMonth) * 100) 
        : 0;
      
      data.push({ name: monthName, value: averageCompletionPercentage });
    }
    return data;
  }, [habits, habitLogs, selectedYearForYearly, isLoading, isClient]);

  const performanceChartConfig = {
    value: { label: "Completion %", color: "hsl(var(--chart-1))" },
  };

  const dailyHabitsForSelectedDate = useMemo(() => {
    if (!selectedDate || isLoading || !isClient) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return habits.filter(habit => {
      const habitCreationDate = startOfDay(parseISO(habit.createdAt));
      return isEqual(habitCreationDate, startOfDay(selectedDate)) || isBefore(habitCreationDate, startOfDay(selectedDate));
    }).map(habit => ({
      ...habit,
      isCompleted: getHabitCompletion(habit.id, dateStr)
    }));
  }, [selectedDate, habits, getHabitCompletion, isLoading, isClient]);
  
  if (isLoading || !isClient) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading Dashboard...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we load your habit data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (habits.length === 0 && !isLoading) {
     return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Habits Tracked</AlertTitle>
          <AlertDescription>
            You haven't added any habits yet. Add some habits on the main page to see your performance here.
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Habit Dashboard</h1>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>View your habit completion for a specific day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full sm:w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && dailyHabitsForSelectedDate.length > 0 ? (
                <DailyHabitStatus habitsForDay={dailyHabitsForSelectedDate} selectedDate={selectedDate} />
              ) : (
                <p className="text-muted-foreground">
                  {selectedDate ? "No habits were active on this day or no data." : "Please select a date."}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Track your daily habit completion percentage over the selected month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {monthlyChartData.length > 0 ? (
                <MonthlyPerformanceChart data={monthlyChartData} chartConfig={performanceChartConfig} />
              ) : (
                <p className="text-muted-foreground">No data available for the selected month, or no habits were active.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Performance</CardTitle>
              <CardDescription>Review your monthly habit completion averages for the selected year.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Select
                  value={selectedYearForYearly.toString()}
                  onValueChange={(value) => setSelectedYearForYearly(parseInt(value))}
                >
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              {yearlyChartData.length > 0 ? (
                 <YearlyPerformanceChart data={yearlyChartData} chartConfig={performanceChartConfig} />
              ) : (
                 <p className="text-muted-foreground">No data available for the selected year or no habits were active.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
