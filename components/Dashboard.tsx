"use client";

import { useMemo, useState, useEffect } from "react";
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
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { useQuery } from "@tanstack/react-query";

const chartConfig = {
  activity: {
    label: "Seismic Activity",
  },
  siAverage: {
    label: "SI Average",
    color: "hsl(var(--chart-1))",
  },
  siMaximum: {
    label: "SI Maximum",
    color: "hsl(var(--chart-2))",
  },
  siMinimum: {
    label: "SI Minimum",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type ReadingData = {
  battery: number;
  createdAt: string;
  id: string;
  siAverage: number;
  siMaximum: number;
  siMinimum: number;
  signalStrength: string;
};

export default function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: readingsData, isLoading } = useQuery({
    queryKey: ["readings", date],
    queryFn: async () => {
      if (!date?.from && !date?.to) return null;

      const params = new URLSearchParams();
      if (date.from) {
        const adjustedFromDate = new Date(
          date.from.getTime() + 8 * 60 * 60 * 1000,
        );
        params.append("startDate", adjustedFromDate.toISOString());
      }
      if (date.to) {
        const adjustedToDate = new Date(date.to.getTime() + 8 * 60 * 60 * 1000);
        params.append("endDate", adjustedToDate.toISOString());
      }

      const response = await fetch(`/api/readings?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch readings");
      }

      return response.json();
    },
    enabled: !!(date?.from || date?.to),
  });

  const readings = useMemo(() => {
    return (readingsData?.data as ReadingData[]) || [];
  }, [readingsData?.data]);

  const batteryLevel = readingsData?.batteryLevel || 0;
  const aiSummary = readingsData?.aiSummary || "";

  const getBatteryColor = (level: number) => {
    if (level >= 70) return "text-green-500";
    if (level >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const [persistedFirstDate, setPersistedFirstDate] = useState<
    Date | undefined
  >();

  useEffect(() => {
    if (readingsData?.firstDate && !persistedFirstDate) {
      setPersistedFirstDate(new Date(readingsData.firstDate));
    }
  }, [readingsData?.firstDate, persistedFirstDate]);

  const chartData = useMemo(() => {
    const isMultipleDays =
      date?.from &&
      date?.to &&
      date.from.toDateString() !== date.to.toDateString();

    return readings.map((reading) => ({
      time: isMultipleDays
        ? new Date(reading.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : new Date(reading.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      fullDateTime: new Date(reading.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      siAverage: reading.siAverage,
      siMaximum: reading.siMaximum,
      siMinimum: reading.siMinimum,
      battery: reading.battery,
    }));
  }, [readings, date]);

  const peakMagnitude = useMemo(() => {
    if (!readings.length) return { value: 0, time: "--" };
    const peak = readings.reduce(
      (max, reading) => (reading.siMaximum > max.siMaximum ? reading : max),
      readings[0],
    );
    return {
      value: peak.siMaximum,
      time: new Date(peak.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }, [readings]);

  const avgMagnitude = useMemo(() => {
    if (!readings.length) return "0.00";
    const sum = readings.reduce((acc, reading) => acc + reading.siAverage, 0);
    return (sum / readings.length).toFixed(2);
  }, [readings]);

  const significantReadings = useMemo(() => {
    const SIGNIFICANT_THRESHOLD = 1.0;
    return readings.filter(
      (reading) => reading.siMaximum > SIGNIFICANT_THRESHOLD,
    ).length;
  }, [readings]);

  const peakActivity = useMemo(() => {
    if (!readings.length) return { value: "--", time: "--" };
    const peak = readings.reduce(
      (max, reading) => (reading.siAverage > max.siAverage ? reading : max),
      readings[0],
    );
    return {
      value: new Date(peak.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      siAverage: peak.siAverage,
    };
  }, [readings]);

  return (
    <div className="grid gap-3">
      <div className="items-center justify-between md:flex">
        <DatePickerWithRange
          date={date}
          onDateChange={setDate}
          startDate={persistedFirstDate}
        />
        <Button
          className="hidden gap-2 md:flex"
          disabled={!formatSeismicMonitorDate(date) || isLoading}
        >
          <FileChartColumnIncreasing />
          Generate Report
        </Button>
      </div>
      <div className="grid gap-3 md:flex">
        <Card className={`w-full ${isLoading ? "blur-sm" : ""}`}>
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Peak SI Maximum</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {formatSeismicMonitorDate(date) && readings.length
                    ? peakMagnitude.value.toFixed(3)
                    : "--"}
                </span>
                <span className="text-muted-foreground ml-2">
                  {formatSeismicMonitorDate(date) && readings.length
                    ? `@ ${peakMagnitude.time}`
                    : ""}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Highest seismic intensity reading during the selected period
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className={`w-full ${isLoading ? "blur-sm" : ""}`}>
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Average SI Reading</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {formatSeismicMonitorDate(date) && readings.length
                    ? avgMagnitude
                    : "--"}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Mean seismic intensity across all readings for the selected
                timeframe
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className={`w-full ${isLoading ? "blur-sm" : ""}`}>
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Significant Activity Readings</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {formatSeismicMonitorDate(date) && readings.length
                    ? significantReadings
                    : "--"}
                </span>
                {formatSeismicMonitorDate(date) && readings.length ? (
                  <span className="text-muted-foreground ml-2">readings</span>
                ) : null}
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Readings where SI Maximum exceeded 1.0
              </p>
            </div>
          </CardHeader>
        </Card>
        <Card className={`w-full ${isLoading ? "blur-sm" : ""}`}>
          <CardHeader className="flex flex-col items-stretch space-y-0 p-0 sm:flex-row">
            <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
              <CardTitle>Peak Activity Time</CardTitle>
              <CardDescription>
                <span className="text-primary text-2xl font-semibold">
                  {formatSeismicMonitorDate(date) && readings.length
                    ? peakActivity.value
                    : "--"}
                </span>
                <span className="text-muted-foreground ml-2">
                  {formatSeismicMonitorDate(date) && readings.length
                    ? `(${peakActivity.siAverage?.toFixed(3)} SI)`
                    : ""}
                </span>
              </CardDescription>
              <p className="text-muted-foreground mt-1 text-xs">
                Time with the highest average seismic intensity
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
      <Card className={isLoading ? "blur-sm" : ""}>
        <CardHeader className="mx-4.5 flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
            <CardTitle>Seismic Activity Monitor</CardTitle>
            <CardDescription>
              {formatSeismicMonitorDate(date)
                ? `Seismic readings for ${formatSeismicMonitorDate(date)} • Data averaged every 5 minutes`
                : "No seismic readings • Data averaged every 5 minutes"}
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
              data={
                formatSeismicMonitorDate(date) && readings.length
                  ? chartData
                  : []
              }
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
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background rounded-lg border p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[0.70rem] uppercase">
                              Time
                            </span>
                            <span className="font-bold">
                              {data.fullDateTime}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-col gap-1">
                          {payload.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm">
                                {entry.name}:{" "}
                                {typeof entry.value === "number"
                                  ? entry.value.toFixed(3)
                                  : "--"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                dataKey="siAverage"
                type="monotone"
                stroke={`var(--color-siAverage)`}
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="siMaximum"
                type="monotone"
                stroke={`var(--color-siMaximum)`}
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="siMinimum"
                type="monotone"
                stroke={`var(--color-siMinimum)`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
        <Card className={`w-full ${isLoading ? "blur-sm" : ""}`}>
          <CardHeader className="mx-4.5 flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
              <CardTitle>Earthquake History</CardTitle>
              <CardDescription>
                Historical earthquake events and intensity records over time
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
                data={
                  formatSeismicMonitorDate(date) && readings.length
                    ? chartData
                    : []
                }
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
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background rounded-lg border p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground text-[0.70rem] uppercase">
                                Time
                              </span>
                              <span className="font-bold">
                                {data.fullDateTime}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-col gap-1">
                            {payload.map((entry, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm">
                                  {entry.name}:{" "}
                                  {typeof entry.value === "number"
                                    ? entry.value.toFixed(3)
                                    : "--"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  dataKey="siAverage"
                  type="monotone"
                  stroke={`var(--color-siAverage)`}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="siMaximum"
                  type="monotone"
                  stroke={`var(--color-siMaximum)`}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="siMinimum"
                  type="monotone"
                  stroke={`var(--color-siMinimum)`}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="grid w-full gap-3">
          <Card
            className={`relative w-full overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 ${isLoading ? "blur-sm" : ""}`}
          >
            <CardHeader className="relative z-10 flex flex-col space-y-0 p-0 sm:flex-row">
              <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                <CardTitle className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text pb-1 font-semibold text-transparent">
                  AI Summary
                </CardTitle>
                <CardDescription>
                  <p className="text-foreground text-sm leading-relaxed">
                    {formatSeismicMonitorDate(date) && aiSummary
                      ? aiSummary
                      : "No AI summary available for the selected period"}
                  </p>
                </CardDescription>
                <p className="text-muted-foreground mt-1 text-xs">
                  AI-generated analysis of seismic activity patterns
                </p>
              </div>
            </CardHeader>
          </Card>
          <Card className={`w-full ${isLoading ? "blur-sm" : ""}`}>
            <CardHeader className="flex flex-col space-y-0 p-0 sm:flex-row">
              <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                <CardTitle>Battery Level</CardTitle>
                <CardDescription>
                  <span
                    className={`text-2xl font-semibold ${getBatteryColor(batteryLevel)}`}
                  >
                    {isLoading ? "--" : `${batteryLevel}%`}
                  </span>
                </CardDescription>
                <p className="text-muted-foreground mt-1 text-xs">
                  Current IoT sensor battery level
                </p>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className="flex w-full justify-center md:hidden">
        <Button className="flex gap-2">
          <FileChartColumnIncreasing />
          Generate Report
        </Button>
      </div>
    </div>
  );
}
