import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProgramPreviewDayCard } from "@/components/ProgramPreviewDayCard";
import { Button } from "@/components/ui/button";
import { resolveLessonPreviewMedia } from "@/lib/mux";
import {
  LANDING_VIDEO_PREVIEW_DURATION_SECONDS,
  LANDING_VIDEO_PREVIEW_START_SECONDS,
} from "@/lib/preview";
import { enrichProgramDaysWithThumbnails, lessonHasVideo } from "@/lib/program";

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
  const enrichedDays = await enrichProgramDaysWithThumbnails(program.days);
  const previewDaySources = [enrichedDays[0], enrichedDays[18]].filter(
    (day): day is (typeof enrichedDays)[number] => Boolean(day),
  );

  const previewDays = await Promise.all(
    previewDaySources.map(async (day) => {
      const previewLesson = day.lessons.find((lesson) => lessonHasVideo(lesson));
      const media = previewLesson
        ? await resolveLessonPreviewMedia(previewLesson, LANDING_VIDEO_PREVIEW_START_SECONDS)
        : null;

      return {
        id: day.id,
        title: day.title,
        description: day.description ?? null,
        lessonCount: day.lessons.length,
        lessonTitles: day.lessons.slice(0, 4).map((lesson) => lesson.title),
        previewVideo:
          previewLesson && media?.playbackId && media.thumbnailUrl
            ? {
                lessonTitle: previewLesson.title,
                playbackId: media.playbackId,
                playbackToken: media.playbackToken,
                thumbnailUrl: media.thumbnailUrl,
                startSeconds: LANDING_VIDEO_PREVIEW_START_SECONDS,
                durationSeconds: LANDING_VIDEO_PREVIEW_DURATION_SECONDS,
              }
            : null,
      };
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
            lessonCount={day.lessonCount}
            lessonTitles={day.lessonTitles}
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
