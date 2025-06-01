
"use client";

import React from 'react';
import type { ChartData, ChartConfig } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface YearlyPerformanceChartProps {
  data: ChartData[]; 
  chartConfig: ChartConfig;
}

export default function YearlyPerformanceChart({ data, chartConfig }: YearlyPerformanceChartProps) {
  if (!data || data.length === 0 || data.every(d => d.value === 0 && d.name === undefined) ) { 
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          There's no performance data for the selected year. Try a different year or track more habits.
        </AlertDescription>
      </Alert>
    );
  }

  const validData = data.filter(d => d.name !== undefined); 

  if (validData.length === 0) {
     return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          No habits were active or tracked during this year.
        </AlertDescription>
      </Alert>
    );
  }
  

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full overflow-x-auto">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={validData}
          margin={{
            top: 5,
            right: 10,
            left: 0, 
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name" 
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            padding={{ left: 10, right: 10 }} 
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            domain={[0, 100]}
            width={35} 
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="value" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]} 
            maxBarSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

