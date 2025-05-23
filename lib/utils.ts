import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeismicMonitorDate(date: DateRange | undefined) {
  const today = new Date();
  const isToday =
    date?.from &&
    date.from.getDate() === today.getDate() &&
    date.from.getMonth() === today.getMonth() &&
    date.from.getFullYear() === today.getFullYear();

  const isSameDay =
    date?.from &&
    date?.to &&
    date.from.getDate() === date.to.getDate() &&
    date.from.getMonth() === date.to.getMonth() &&
    date.from.getFullYear() === date.to.getFullYear();

  if (isToday && isSameDay) {
    return "Hourly";
  }

  if (!date?.from || !date?.to) return "";

  if (isSameDay) {
    return format(date.from, "MMMM d, yyyy");
  }

  const fromYear = date.from.getFullYear();
  const toYear = date.to.getFullYear();

  if (fromYear === toYear) {
    return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`;
  } else {
    return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`;
  }
}
