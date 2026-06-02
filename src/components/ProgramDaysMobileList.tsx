import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { Progress } from "@/components/ui/progress";
import type { ProgramDayNavItem } from "@/lib/program-nav";

export function ProgramDaysMobileList({
  days,
}: {
  days: (ProgramDayNavItem & { description?: string | null; lessonCount: number })[];
}) {
  return (
    <div className="space-y-3 lg:hidden">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Všetky dni</p>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {days.map((day) => (
          <li key={day.id}>
            <Link
              href={`/program/den/${day.slug}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-muted"
            >
              <LessonThumbnail src={day.thumbnailUrl ?? null} title={day.title} size="xs" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug">{day.title}</p>
                  {day.completed ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-label="Deň dokončený" />
                  ) : (
                    <span className="shrink-0 text-xs text-muted-foreground">{day.progress}%</span>
                  )}
                </div>
                <Progress value={day.progress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">
                  {day.description ?? `${day.lessonCount} lekcií`}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
