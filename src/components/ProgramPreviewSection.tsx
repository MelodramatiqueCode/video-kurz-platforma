import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enrichProgramDaysWithThumbnails } from "@/lib/program";

type PreviewProgram = {
  title: string;
  days: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    lessons: {
      id: string;
      title: string;
      muxAssetId: string | null;
      muxPlaybackId: string | null;
    }[];
  }[];
};

export async function ProgramPreviewSection({ program }: { program: PreviewProgram }) {
  const previewDays = (await enrichProgramDaysWithThumbnails(program.days)).slice(0, 2);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Ukážka obsahu</h2>
        <p className="text-muted-foreground">Prvé dni programu {program.title}.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {previewDays.map((day) => (
          <Card key={day.id}>
            {day.previewThumbnail ? (
              <div className="border-b border-border p-3">
                <LessonThumbnail src={day.previewThumbnail} title={day.title} size="lg" />
              </div>
            ) : null}
            <CardHeader>
              <CardTitle>{day.title}</CardTitle>
              <CardDescription>{day.description ?? `${day.lessons.length} lekcií`}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {day.lessons.slice(0, 4).map((lesson) => (
                  <li key={lesson.id}>{lesson.title}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button asChild variant="outline">
        <Link href="/prihlasenie">
          Prihlásiť sa a získať plný prístup
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
