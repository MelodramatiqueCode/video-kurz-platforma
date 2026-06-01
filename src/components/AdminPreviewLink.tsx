import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminPreviewLink({
  daySlug,
  lessonId,
}: {
  daySlug: string;
  lessonId?: string;
}) {
  const href = lessonId
    ? `/program/den/${daySlug}#lesson-${lessonId}`
    : `/program/den/${daySlug}`;

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href} target="_blank" rel="noreferrer">
        Náhľad ako študent
        <ExternalLink className="h-4 w-4" />
      </Link>
    </Button>
  );
}
