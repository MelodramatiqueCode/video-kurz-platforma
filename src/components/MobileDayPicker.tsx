"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { formatDayNavLabel, type ProgramDayNavItem } from "@/lib/program-nav";
import { cn } from "@/lib/utils";

export function MobileDayPicker({
  days,
  activeSlug,
  className,
}: {
  days: ProgramDayNavItem[];
  activeSlug?: string;
  className?: string;
}) {
  const router = useRouter();
  const value = activeSlug ?? days[0]?.slug ?? "";

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="mobile-day-picker" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Prejsť na deň
      </label>
      <div className="relative">
        <select
          id="mobile-day-picker"
          value={value}
          onChange={(event) => router.push(`/program/den/${event.target.value}`)}
          className="w-full appearance-none rounded-xl border border-border bg-card py-3 pr-10 pl-4 text-sm font-medium shadow-sm"
        >
          {days.map((day) => (
            <option key={day.slug} value={day.slug}>
              {formatDayNavLabel(day)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
