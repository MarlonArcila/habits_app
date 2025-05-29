
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

  // Determine X-axis interval based on data length to avoid overcrowding
  // Show a tick roughly every 5-7 days depending on month length
  const xAxisInterval = data.length > 15 ? Math.floor(data.length / 7) : 0;


  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 5, // Adjusted to ensure Y-axis labels are visible
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="name" // 'name' here refers to the day of the month
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 10, right: 10 }} // Adjusted padding for X-axis
            interval={xAxisInterval} // Show fewer ticks on X-axis
            // tickFormatter={(value) => value} // Day number
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

