import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type DayRef = {
  slug: string;
  title: string;
};

export function DayNavigation({
  previous,
  next,
}: {
  previous: DayRef | null;
  next: DayRef | null;
}) {
  if (!previous && !next) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-between">
      {previous ? (
        <Button asChild variant="outline" className="justify-start">
          <Link href={`/program/den/${previous.slug}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="truncate">{previous.title}</span>
          </Link>
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button asChild className="justify-end sm:ml-auto">
          <Link href={`/program/den/${next.slug}`}>
            <span className="truncate">Ďalej: {next.title}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
