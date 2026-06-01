import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProgramPreviewDayCard } from "@/components/ProgramPreviewDayCard";
import { Button } from "@/components/ui/button";
import { resolveLessonMedia } from "@/lib/mux";
import {
  LANDING_VIDEO_PREVIEW_DURATION_SECONDS,
  LANDING_VIDEO_PREVIEW_START_SECONDS,
} from "@/lib/preview";
import { lessonHasVideo } from "@/lib/program";

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
  const previewDaySources = [program.days[0], program.days[18]].filter(
    (day): day is (typeof program.days)[number] => Boolean(day),
  );

  const previewDays = await Promise.all(
    previewDaySources.map(async (day) => {
      try {
        const previewLesson = day.lessons.find((lesson) => lessonHasVideo(lesson));
        const media = previewLesson ? await resolveLessonMedia(previewLesson) : null;

        return {
          id: day.id,
          title: day.title,
          description: day.description ?? null,
          previewVideo:
            previewLesson && media?.playbackId
              ? {
                  lessonTitle: previewLesson.title,
                  playbackId: media.playbackId,
                  playbackToken: media.playbackToken,
                  startSeconds: LANDING_VIDEO_PREVIEW_START_SECONDS,
                  durationSeconds: LANDING_VIDEO_PREVIEW_DURATION_SECONDS,
                }
              : null,
        };
      } catch {
        return {
          id: day.id,
          title: day.title,
          description: day.description ?? null,
          previewVideo: null,
        };
      }
    }),
  );

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Ukážka obsahu</h2>
        <p className="text-muted-foreground">
          Pozrite si krátku ukážku z programu {program.title}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {previewDays.map((day) => (
          <ProgramPreviewDayCard
            key={day.id}
            dayTitle={day.title}
            description={day.description}
            previewVideo={day.previewVideo}
          />
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
