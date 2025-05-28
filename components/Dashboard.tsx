"use client";

import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { FileChartColumnIncreasing } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { formatSeismicMonitorDate } from "@/lib/utils";

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
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

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

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  return (
    <div className="grid gap-3">
      <div className="items-center justify-between md:flex">
        <DatePickerWithRange date={date} onDateChange={setDate} />
        <Button
          className="hidden gap-2 md:flex"
          disabled={!formatSeismicMonitorDate(date)}
        >
          <FileChartColumnIncreasing />
          Generate Report
        </Button>
      </div>
      <Card>
        <CardHeader className="mx-4.5 flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
            <CardTitle>Seismic Activity Monitor</CardTitle>
            <CardDescription>
              {formatSeismicMonitorDate(date)
                ? `Earthquake readings for ${formatSeismicMonitorDate(date)}`
                : "No earthquake readings"}
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
              data={formatSeismicMonitorDate(date) ? chartData : []}
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
              <CardTitle>Peak Magnitude</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {formatSeismicMonitorDate(date)
                    ? peakMagnitude.value.toFixed(1)
                    : "--"}
                </span>
                <span className="text-muted-foreground ml-2">
                  {formatSeismicMonitorDate(date)
                    ? `@ ${peakMagnitude.time}`
                    : ""}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Strongest seismic event detected during the selected time period
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Average Magnitude</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {formatSeismicMonitorDate(date) ? avgMagnitude : "--"}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Mean seismic intensity across all readings for the selected
                timeframe
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
                  {formatSeismicMonitorDate(date) ? significantHours : "--"}
                </span>
                {formatSeismicMonitorDate(date) ? (
                  <span className="text-muted-foreground ml-2">hours</span>
                ) : null}
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
                  {formatSeismicMonitorDate(date) ? peakFrequency.time : "--"}
                </span>
                <span className="text-muted-foreground ml-2">
                  {formatSeismicMonitorDate(date)
                    ? `(${peakFrequency.value} events)`
                    : ""}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Hour with the most frequent seismic events
              </p>
            </div>
          </CardHeader>
        </Card>
        <div className="flex w-full justify-center md:hidden">
          <Button className="flex gap-2">
            <FileChartColumnIncreasing />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}
