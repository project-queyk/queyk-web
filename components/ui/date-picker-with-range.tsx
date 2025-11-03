"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
  startDate,
  disabled = false,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  startDate?: Date;
  disabled?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "max-w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
            disabled={disabled}
            aria-disabled={disabled}
          >
            <CalendarIcon />
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  date.from.getTime() === date.to.getTime() ? (
                    format(date.from, "LLL dd, y")
                  ) : (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  )
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            disabled={
              startDate
                ? { before: startDate, after: new Date() }
                : { after: new Date() }
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
