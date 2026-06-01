import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type DayRef = {
  slug: string;
  title: string;
};

export function LessonNavigation({
  previousDay,
  nextDay,
}: {
  previousDay: DayRef | null;
  nextDay: DayRef | null;
}) {
  if (!previousDay && !nextDay) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
      {previousDay ? (
        <Button asChild variant="outline" className="justify-start">
          <Link href={`/program/den/${previousDay.slug}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="truncate">Späť: {previousDay.title}</span>
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {nextDay ? (
        <Button asChild className="justify-end sm:ml-auto">
          <Link href={`/program/den/${nextDay.slug}`}>
            <span className="truncate">Ďalej: {nextDay.title}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
