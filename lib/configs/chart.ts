import { ChartConfig } from "@/components/ui/chart";

export const readingChartConfig = {
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

export const skeletonReadingChartConfig = {
  activity: {
    label: "Seismic Activity",
  },
  siAverage: {
    label: "SI Average",
    color: "#d1d5db",
  },
  siMaximum: {
    label: "SI Maximum",
    color: "#e5e7eb",
  },
  siMinimum: {
    label: "SI Minimum",
    color: "#f3f4f6",
  },
} satisfies ChartConfig;

export const earthquakeChartConfig = {
  activity: {
    label: "Earthquake Activity",
  },
  magnitude: {
    label: "Magnitude",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const skeletonEarthquakeConfig = {
  activity: {
    label: "Earthquake Activity",
  },
  magnitude: {
    label: "Magnitude",
    color: "#e5e7eb",
  },
} satisfies ChartConfig;
