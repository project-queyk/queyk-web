"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  activity: {
    label: "Seismic Activity",
  },
  magnitude: {
    label: "Magnitude",
    color: "hsl(var(--chart-1))",
  },
  frequency: {
    label: "Frequency",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Dashboard({
  chartData,
}: {
  chartData: { time: string; magnitude: number; frequency: number }[];
}) {
  const peakMagnitude = useMemo(() => {
    const peak = chartData.reduce(
      (max, point) => (point.magnitude > max.magnitude ? point : max),
      chartData[0],
    );
    return {
      value: peak.magnitude,
      time: peak.time,
    };
  }, [chartData]);

  const avgMagnitude = useMemo(() => {
    const sum = chartData.reduce((acc, point) => acc + point.magnitude, 0);
    return (sum / chartData.length).toFixed(2);
  }, [chartData]);

  const significantHours = useMemo(() => {
    const SIGNIFICANT_THRESHOLD = 1.0;
    return chartData.filter((point) => point.magnitude > SIGNIFICANT_THRESHOLD)
      .length;
  }, [chartData]);

  const peakFrequency = useMemo(() => {
    const peak = chartData.reduce(
      (max, point) => (point.frequency > max.frequency ? point : max),
      chartData[0],
    );
    return {
      value: peak.frequency,
      time: peak.time,
    };
  }, [chartData]);

  return (
    <div className="grid gap-3">
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-3">
            <CardTitle>Seismic Activity Monitor</CardTitle>
            <CardDescription>
              Hourly earthquake readings for today
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="magnitude"
                type="monotone"
                stroke={`var(--color-magnitude)`}
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="frequency"
                type="monotone"
                stroke={`var(--color-frequency)`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="grid gap-3 md:flex">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Today&apos;s Peak Magnitude</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {peakMagnitude.value.toFixed(1)}
                </span>
                <span className="text-muted-foreground ml-2">
                  @ {peakMagnitude.time}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Highest intensity reading recorded today
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Today&apos;s Average Magnitude</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {avgMagnitude}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Baseline seismic activity level for today
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Hours with Significant Activity</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {significantHours}
                </span>
                <span className="text-muted-foreground ml-2">hours</span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Periods where magnitude exceeded 1.0
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Peak Activity Hour</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {peakFrequency.time}
                </span>
                <span className="text-muted-foreground ml-2">
                  ({peakFrequency.value} events)
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Hour with the most frequent seismic events
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
