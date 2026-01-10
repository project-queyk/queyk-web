import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeismicMonitorDate(date: DateRange | undefined) {
  if (!date?.from || !date?.to) return "";

  const isSameDay =
    date.from.getDate() === date.to.getDate() &&
    date.from.getMonth() === date.to.getMonth() &&
    date.from.getFullYear() === date.to.getFullYear();

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

export function getRiskLevelColor(level: string) {
  switch (level) {
    case "normal":
    case "minor":
      return "text-green-500";
    case "elevated":
    case "moderate":
      return "text-yellow-500";
    case "concerning":
    case "major":
      return "text-orange-500";
    case "severe":
      return "text-red-500";
    default:
      return "";
  }
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
