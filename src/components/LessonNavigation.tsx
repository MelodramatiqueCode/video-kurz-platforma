import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type LessonRef = {
  daySlug: string;
  dayTitle: string;
  lessonId: string;
  lessonTitle: string;
};

export function LessonNavigation({
  previous,
  next,
}: {
  previous: LessonRef | null;
  next: LessonRef | null;
}) {
  if (!previous && !next) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
      {previous ? (
        <Button asChild variant="outline" className="justify-start">
          <Link href={`/program/den/${previous.daySlug}#lesson-${previous.lessonId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="truncate">{previous.lessonTitle}</span>
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button asChild className="justify-end sm:ml-auto">
          <Link href={`/program/den/${next.daySlug}#lesson-${next.lessonId}`}>
            <span className="truncate">{next.lessonTitle}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
