
"use client";

import React from 'react';
import type { ChartData, ChartConfig } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface MonthlyPerformanceChartProps {
  data: ChartData[];
  chartConfig: ChartConfig;
}

export default function MonthlyPerformanceChart({ data, chartConfig }: MonthlyPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          There's no performance data for the selected month. Try a different period or track more habits.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20, // Adjusted to make Y-axis labels more visible
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name" // 'name' here refers to the day of the month
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 20, right: 20 }} // Added padding for X-axis
            // tickFormatter={(value) => value} // Day number
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[0, 100]}
            width={50} // Ensure enough space for labels like "100%"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="value" // 'value' here refers to completion percentage
            type="monotone"
            stroke={`hsl(var(--primary))`} // Use primary color from theme
            strokeWidth={2}
            dot={{
              fill: `hsl(var(--primary))`,
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
