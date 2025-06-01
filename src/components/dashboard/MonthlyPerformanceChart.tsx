
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

  let xAxisInterval = 0;
  const numDays = data.length;
  if (numDays > 25) { 
    xAxisInterval = 5; 
  } else if (numDays > 15) { 
    xAxisInterval = 3; 
  } else if (numDays > 7) { 
    xAxisInterval = 1; 
  }


  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full overflow-x-auto">
      <ResponsiveContainer width="100%" height={300} minWidth={0}>
        <LineChart
          data={data}
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
            interval={xAxisInterval} 
          />
          <YAxis
            dataKey="value"
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tickMargin={5}
            domain={[0, 100]}
            width={35} 
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="value" 
            type="monotone"
            stroke={`hsl(var(--primary))`} 
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

