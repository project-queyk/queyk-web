"use client";

import { Session } from "next-auth";
import { DateRange } from "react-day-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { FileChartColumnIncreasing, Info, Power } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { useSocket } from "@/hooks/useSocket";
import { ReadingData } from "@/lib/types/readings";
import { formatSeismicMonitorDate } from "@/lib/utils";
import { EarthquakeData } from "@/lib/types/earthquake";

import {
  earthquakeChartConfig,
  readingChartConfig,
  skeletonEarthquakeConfig,
  skeletonReadingChartConfig,
} from "@/lib/configs/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

export default function Dashboard({ session }: { session: Session }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [cooldown, setCooldown] = useState(0);

  const { isConnected } = useSocket();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const { data: readingsData, isLoading: readingsDataIsLoading } = useQuery({
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
    enabled: !!(date?.from || date?.to) && session.user.role === "admin",
  });

  const { data: earthquakesData, isLoading: earthquakeDataIsLoading } =
    useQuery({
      queryKey: ["earthquakes"],
      queryFn: async () => {
        const response = await fetch(`/api/earthquakes`);
        if (!response.ok) {
          throw new Error("Failed to fetch earthquake readings");
        }

        return response.json();
      },
    });

  const { mutate: resetIoT, isPending: resetIoTIsPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/iot/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to reboot IoT device");
      }

      return response.json();
    },
  });

  const readings = useMemo(() => {
    return (readingsData?.data as ReadingData[]) || [];
  }, [readingsData?.data]);

  const batteryLevel = readingsData?.batteryLevel || 0;
  const aiSummary =
    session.user.role === "admin"
      ? readingsData?.aiSummary || ""
      : earthquakesData?.aiSummary || "";

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
    if (readingsDataIsLoading) {
      return Array.from({ length: 8 }, (_, i) => ({
        time: `${i + 1}:00`,
        fullDateTime: `Loading...`,
        siAverage: 0.2 + Math.random() * 0.3,
        siMaximum: 0.4 + Math.random() * 0.4,
        siMinimum: 0.1 + Math.random() * 0.2,
        battery: 85 + Math.random() * 10,
      }));
    }

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
  }, [readings, date, readingsDataIsLoading]);

  const earthquakeHistoryData = useMemo(() => {
    if (earthquakeDataIsLoading) {
      return Array.from({ length: 6 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        return {
          id: `skeleton-${i}`,
          createdAt: date.toISOString(),
          magnitude: 3.0 + Math.random() * 4.0,
          duration: 10 + Math.random() * 50,
          time: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };
      });
    }

    const earthquakes = (earthquakesData?.data as EarthquakeData[]) || [];
    return earthquakes.map((earthquake) => ({
      ...earthquake,
      time: new Date(earthquake.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [earthquakeDataIsLoading, earthquakesData]);

  const peakMagnitude = useMemo(() => {
    if (!readings.length) return { value: 0, time: "--", fullDateTime: null };
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
      fullDateTime: peak.createdAt,
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
    if (!readings.length)
      return { value: "--", siAverage: 0, fullDateTime: null };
    const peak = readings.reduce(
      (max, reading) => (reading.siAverage > max.siAverage ? reading : max),
      readings[0],
    );
    return {
      value: new Date(peak.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      siAverage: peak.siAverage,
      fullDateTime: peak.createdAt,
    };
  }, [readings]);

  function downloadReport(
    pdfBase64: string,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");

      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());

      const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

      const pdfBlob = new Blob(
        [Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0))],
        { type: "application/pdf" },
      );

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;

      const filename =
        startDate && endDate
          ? `seismic-report-${startDate.split("T")[0]}-to-${
              endDate.split("T")[0]
            }_${timestamp}.pdf`
          : `seismic-report_${timestamp}.pdf`;

      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch {
      try {
        const pdfBlob = new Blob(
          [Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0))],
          { type: "application/pdf" },
        );
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, "_blank");
      } catch {}
    }
  }

  return (
    <div className="grid gap-3">
      {session.user.role === "admin" ? (
        <>
          <div className="flex items-center justify-between">
            <DatePickerWithRange
              date={date}
              onDateChange={setDate}
              startDate={persistedFirstDate}
              disabled={readingsDataIsLoading}
            />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className={isConnected ? "text-green-600" : "text-red-600"}
                >
                  {process.env.NEXT_PUBLIC_BACKEND_URL?.includes("vercel.app")
                    ? isConnected
                      ? "Auto-Update"
                      : "Update Offline"
                    : isConnected
                      ? "Live"
                      : "Offline"}
                </span>
              </div>
              <Button
                className="flex gap-2"
                disabled={
                  !formatSeismicMonitorDate(date) ||
                  readingsDataIsLoading ||
                  !!!readingsData?.data?.length
                }
                onClick={() =>
                  downloadReport(
                    readingsData.pdfBase64,
                    date?.from?.toISOString(),
                    date?.to?.toISOString(),
                  )
                }
              >
                <FileChartColumnIncreasing />
                Generate
              </Button>
            </div>
          </div>
          <div className="grid gap-3 md:flex">
            <Card className="flex w-full">
              <CardHeader className="flex flex-col items-stretch space-y-0 p-0">
                <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                  <CardTitle className="relative mb-2">
                    <p>Peak SI Maximum</p>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-0 right-0 z-10">
                        <Info className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Highest seismic intensity reading during the selected
                          period
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription className="flex w-full items-center justify-between">
                    {readingsDataIsLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 rounded bg-gray-300"></div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-primary text-2xl font-semibold">
                          {formatSeismicMonitorDate(date) && readings.length
                            ? peakMagnitude.value.toFixed(3)
                            : "--"}
                        </span>
                        <span className="text-muted-foreground block">
                          {formatSeismicMonitorDate(date) && readings.length
                            ? `at ${peakMagnitude.time}`
                            : "No data"}
                        </span>
                      </div>
                    )}
                    {readingsDataIsLoading ? (
                      <div className="h-16 w-24 animate-pulse rounded bg-gray-200 pt-4"></div>
                    ) : (
                      <ChartContainer
                        config={{
                          siMaximum: {
                            label: "SI Maximum",
                            color: "hsl(var(--chart-2))",
                          },
                        }}
                        className="h-16 w-24"
                      >
                        <LineChart
                          data={chartData.slice(-7)}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <Line
                            type="stepAfter"
                            dataKey="siMaximum"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="flex w-full">
              <CardHeader className="flex flex-col items-stretch space-y-0 p-0">
                <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                  <CardTitle className="relative mb-2">
                    <p>Average SI Reading</p>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-0 right-0 z-10">
                        <Info className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Mean seismic intensity across all readings for the
                          selected timeframe
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription className="flex w-full items-center justify-between">
                    {readingsDataIsLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 rounded bg-gray-300"></div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-primary text-2xl font-semibold">
                          {formatSeismicMonitorDate(date) && readings.length
                            ? avgMagnitude
                            : "--"}
                        </span>
                        <span className="text-muted-foreground block">
                          {formatSeismicMonitorDate(date) && readings.length
                            ? `across ${readings.length} readings`
                            : "No data"}
                        </span>
                      </div>
                    )}
                    {readingsDataIsLoading ? (
                      <div className="h-16 w-24 animate-pulse rounded bg-gray-200 pt-4"></div>
                    ) : (
                      <ChartContainer
                        config={{
                          siAverage: {
                            label: "SI Average",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-16 w-24"
                      >
                        <LineChart
                          data={chartData.slice(-7)}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <Line
                            type="basis"
                            dataKey="siAverage"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="flex w-full">
              <CardHeader className="flex flex-col items-stretch space-y-0 p-0">
                <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                  <CardTitle className="relative mb-2">
                    <p>Significant Activity Readings</p>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-0 right-0 z-10">
                        <Info className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Readings where SI Maximum exceeded 1.0</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription className="flex w-full items-center justify-between">
                    {readingsDataIsLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 rounded bg-gray-300"></div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-primary text-2xl font-semibold">
                          {formatSeismicMonitorDate(date) && readings.length
                            ? significantReadings
                            : "--"}
                        </span>
                        <span className="text-muted-foreground block">
                          {formatSeismicMonitorDate(date) && readings.length
                            ? `readings above threshold`
                            : "No data"}
                        </span>
                      </div>
                    )}
                    {readingsDataIsLoading ? (
                      <div className="h-16 w-24 animate-pulse rounded bg-gray-200 pt-4"></div>
                    ) : (
                      <ChartContainer
                        config={{
                          significant: {
                            label: "Significant Readings",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                        className="h-16 w-24"
                      >
                        <LineChart
                          data={chartData.slice(-7).map((item) => {
                            const isSignificant = item.siMaximum > 1.0;
                            return {
                              ...item,
                              significant: isSignificant ? 1 : 0,
                            };
                          })}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <Line
                            type="monotone"
                            dataKey="significant"
                            stroke="hsl(var(--chart-3))"
                            strokeWidth={1.5}
                            dot={true}
                          />
                        </LineChart>
                      </ChartContainer>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="flex w-full">
              <CardHeader className="flex flex-col items-stretch space-y-0 p-0">
                <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                  <CardTitle className="relative mb-2">
                    <p>Peak Activity Time</p>
                    <Tooltip>
                      <TooltipTrigger className="absolute top-0 right-0 z-10">
                        <Info className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Time with the highest average seismic intensity</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription className="flex w-full items-center justify-between">
                    {readingsDataIsLoading ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-16 rounded bg-gray-300"></div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-primary text-2xl font-semibold">
                          {formatSeismicMonitorDate(date) &&
                          readings.length &&
                          peakActivity.fullDateTime
                            ? new Date(
                                peakActivity.fullDateTime,
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--"}
                        </span>
                        <span className="text-muted-foreground block">
                          {formatSeismicMonitorDate(date) &&
                          readings.length &&
                          peakActivity.fullDateTime
                            ? `${new Date(
                                peakActivity.fullDateTime,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })} (${peakActivity.siAverage?.toFixed(3)} SI)`
                            : "No data"}
                        </span>
                      </div>
                    )}
                    {readingsDataIsLoading ? (
                      <div className="h-16 w-24 animate-pulse rounded bg-gray-200 pt-4"></div>
                    ) : (
                      <ChartContainer
                        config={{
                          activityTime: {
                            label: "Activity Intensity",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        className="h-16 w-24"
                      >
                        <LineChart
                          data={chartData.slice(-7).map((item) => {
                            return {
                              ...item,
                              activityTime: item.siAverage,
                              isPeakTime:
                                peakActivity.fullDateTime &&
                                new Date(item.fullDateTime).getTime() ===
                                  new Date(peakActivity.fullDateTime).getTime(),
                            };
                          })}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <Line
                            type="monotone"
                            dataKey="activityTime"
                            stroke="hsl(var(--chart-4))"
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
          <Card>
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
                config={
                  readingsDataIsLoading
                    ? skeletonReadingChartConfig
                    : readingChartConfig
                }
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
                  {!readingsDataIsLoading && (
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
                  )}
                  <Line
                    dataKey="siAverage"
                    type="monotone"
                    stroke={
                      readingsDataIsLoading
                        ? "#d1d5db"
                        : `var(--color-siAverage)`
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="siMaximum"
                    type="monotone"
                    stroke={
                      readingsDataIsLoading
                        ? "#e5e7eb"
                        : `var(--color-siMaximum)`
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="siMinimum"
                    type="monotone"
                    stroke={
                      readingsDataIsLoading
                        ? "#f3f4f6"
                        : `var(--color-siMinimum)`
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </>
      ) : null}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
        <Card className="hidden w-full md:block">
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
              config={
                earthquakeDataIsLoading
                  ? skeletonEarthquakeConfig
                  : earthquakeChartConfig
              }
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={earthquakeHistoryData}
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
                {!earthquakeDataIsLoading && (
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
                                  {new Date(data.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: "hsl(var(--chart-1))",
                                  }}
                                />
                                <span className="text-sm">
                                  Magnitude:{" "}
                                  {typeof data.magnitude === "number"
                                    ? data.magnitude.toFixed(1)
                                    : "--"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-400" />
                                <span className="text-sm">
                                  Duration:{" "}
                                  {typeof data.duration === "number"
                                    ? (() => {
                                        const seconds = data.duration;
                                        if (seconds >= 3600) {
                                          const hours = Math.floor(
                                            seconds / 3600,
                                          );
                                          const mins = Math.floor(
                                            (seconds % 3600) / 60,
                                          );
                                          const secs = seconds % 60;
                                          return `${hours}h ${mins}m ${secs}s`;
                                        } else if (seconds >= 60) {
                                          const mins = Math.floor(seconds / 60);
                                          const secs = seconds % 60;
                                          return `${mins}m ${secs}s`;
                                        } else {
                                          return `${seconds}s`;
                                        }
                                      })()
                                    : "--"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                )}
                <Line
                  dataKey="magnitude"
                  type="monotone"
                  stroke={
                    earthquakeDataIsLoading ? "#e5e7eb" : "hsl(var(--chart-1))"
                  }
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="grid w-full gap-3">
          <Card className="relative w-full overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
            <CardHeader className="relative z-10 flex flex-col space-y-0 p-0 sm:flex-row">
              <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                <CardTitle className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text pb-1 font-semibold text-transparent">
                  AI Summary
                </CardTitle>
                <CardDescription>
                  {readingsDataIsLoading ? (
                    <div className="space-y-2">
                      <div className="ai-shimmer h-4 w-full animate-[shimmer_8s_linear_infinite] rounded"></div>
                      <div
                        className="ai-shimmer h-4 w-3/4 animate-[shimmer_8s_linear_infinite] rounded"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                      <div
                        className="ai-shimmer h-4 w-1/2 animate-[shimmer_8s_linear_infinite] rounded"
                        style={{ animationDelay: "0.8s" }}
                      ></div>
                    </div>
                  ) : (
                    <p className="text-foreground text-sm leading-relaxed">
                      {formatSeismicMonitorDate(date) && aiSummary
                        ? aiSummary
                        : "No AI summary available for the selected period"}
                    </p>
                  )}
                </CardDescription>
                <p className="text-muted-foreground mt-1 text-xs">
                  AI-generated analysis of seismic activity patterns
                </p>
              </div>
            </CardHeader>
          </Card>
          {session.user.role === "admin" ? (
            <div className="relative">
              <Card className="w-full">
                <CardHeader className="flex flex-col space-y-0 p-0 sm:flex-row">
                  <div className="flex flex-col justify-center gap-1 px-6 py-2 sm:py-3">
                    <CardTitle>Battery Level</CardTitle>
                    <CardDescription>
                      {readingsDataIsLoading ? (
                        <div className="animate-pulse">
                          <div className="h-8 w-16 rounded bg-gray-300"></div>
                        </div>
                      ) : (
                        <span
                          className={`text-2xl font-semibold ${cooldown ? "text-primary" : batteryLevel ? getBatteryColor(batteryLevel) : "text-red-500"}`}
                        >
                          {cooldown
                            ? "Rebooting..."
                            : batteryLevel
                              ? `${batteryLevel}%`
                              : "Offline"}
                        </span>
                      )}
                    </CardDescription>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Current IoT sensor battery level
                    </p>
                  </div>
                </CardHeader>
              </Card>
              <Button
                variant="secondary"
                className="absolute top-6 right-6 flex-shrink-0 cursor-pointer"
                disabled={resetIoTIsPending || cooldown > 0 || !batteryLevel}
                onClick={() => {
                  resetIoT();
                  setCooldown(30);
                }}
              >
                <Power />
                <p>Reboot device</p>
              </Button>
            </div>
          ) : null}
        </div>
        <Card className="w-full md:hidden">
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
              config={
                earthquakeDataIsLoading
                  ? skeletonEarthquakeConfig
                  : earthquakeChartConfig
              }
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={earthquakeHistoryData}
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
                {!earthquakeDataIsLoading && (
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
                                  {new Date(data.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: "hsl(var(--chart-1))",
                                  }}
                                />
                                <span className="text-sm">
                                  Magnitude:{" "}
                                  {typeof data.magnitude === "number"
                                    ? data.magnitude.toFixed(1)
                                    : "--"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-400" />
                                <span className="text-sm">
                                  Duration:{" "}
                                  {typeof data.duration === "number"
                                    ? (() => {
                                        const seconds = data.duration;
                                        if (seconds >= 3600) {
                                          const hours = Math.floor(
                                            seconds / 3600,
                                          );
                                          const mins = Math.floor(
                                            (seconds % 3600) / 60,
                                          );
                                          const secs = seconds % 60;
                                          return `${hours}h ${mins}m ${secs}s`;
                                        } else if (seconds >= 60) {
                                          const mins = Math.floor(seconds / 60);
                                          const secs = seconds % 60;
                                          return `${mins}m ${secs}s`;
                                        } else {
                                          return `${seconds}s`;
                                        }
                                      })()
                                    : "--"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                )}
                <Line
                  dataKey="magnitude"
                  type="monotone"
                  stroke={
                    earthquakeDataIsLoading ? "#e5e7eb" : "hsl(var(--chart-1))"
                  }
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
