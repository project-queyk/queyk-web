import { Metadata } from "next";

import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Monitor seismic activity with comprehensive data visualization. Track earthquake magnitude and frequency patterns with date picker selection and interactive charts showing detailed hourly breakdowns.",
};

const chartData = [
  { time: "00:00", magnitude: 0.8, frequency: 2 },
  { time: "01:00", magnitude: 0.5, frequency: 1 },
  { time: "02:00", magnitude: 0.3, frequency: 0 },
  { time: "03:00", magnitude: 0.4, frequency: 1 },
  { time: "04:00", magnitude: 0.2, frequency: 0 },
  { time: "05:00", magnitude: 0.3, frequency: 1 },
  { time: "06:00", magnitude: 1.1, frequency: 3 },
  { time: "07:00", magnitude: 2.3, frequency: 8 },
  { time: "08:00", magnitude: 1.7, frequency: 5 },
  { time: "09:00", magnitude: 1.2, frequency: 4 },
  { time: "10:00", magnitude: 0.9, frequency: 2 },
  { time: "11:00", magnitude: 2.8, frequency: 7 },
  { time: "12:00", magnitude: 3.2, frequency: 12 },
  { time: "13:00", magnitude: 2.1, frequency: 6 },
  { time: "14:00", magnitude: 1.5, frequency: 3 },
  { time: "15:00", magnitude: 0.7, frequency: 2 },
  { time: "16:00", magnitude: 1.3, frequency: 4 },
  { time: "17:00", magnitude: 1.9, frequency: 5 },
  { time: "18:00", magnitude: 0.6, frequency: 2 },
  { time: "19:00", magnitude: 0.4, frequency: 1 },
  { time: "20:00", magnitude: 0.3, frequency: 0 },
  { time: "21:00", magnitude: 0.5, frequency: 1 },
  { time: "22:00", magnitude: 0.4, frequency: 1 },
  { time: "23:00", magnitude: 0.2, frequency: 0 },
];

export default function Page() {
  return <Dashboard chartData={chartData} />;
}
