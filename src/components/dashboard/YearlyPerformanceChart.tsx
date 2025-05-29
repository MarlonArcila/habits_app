
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
  data: ChartData[]; // Expects { name: "MonthAbbr", value: percentage }
  chartConfig: ChartConfig;
}

export default function YearlyPerformanceChart({ data, chartConfig }: YearlyPerformanceChartProps) {
  if (!data || data.length === 0 || data.every(d => d.value === 0 && d.name === undefined) ) { // Check if all data points are essentially empty
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

  const validData = data.filter(d => d.name !== undefined); // Filter out undefined month names which might occur if no habits active at all

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
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={validData}
          margin={{
            top: 5,
            right: 10,
            left: 5, // Adjusted to ensure Y-axis labels are visible
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name" // Month abbreviation (e.g., Jan, Feb)
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 10, right: 10 }} // Adjusted padding
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[0, 100]}
            width={40} // Adjusted width for Y-axis labels
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="value" // Average completion percentage
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]} // Rounded top corners for bars
            // barSize={30} // Consider removing for auto-sizing or make it smaller for mobile
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

