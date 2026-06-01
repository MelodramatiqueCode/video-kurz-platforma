import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { AttachmentList } from "@/components/AttachmentList";
import { DaySidebar } from "@/components/AppHeader";
import { LessonNavigation } from "@/components/LessonNavigation";
import { LessonProgressToggle } from "@/components/LessonProgressToggle";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { MuxVideoPlayer } from "@/components/MuxVideoPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProgramAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resolveLessonMedia } from "@/lib/mux";
import {
  calculateDayProgress,
  enrichProgramDaysWithThumbnails,
  getDayBySlug,
  getDayNeighbors,
  isDayComplete,
  lessonHasVideo,
} from "@/lib/program";

export const dynamic = "force-dynamic";

export default async function DayPage({
  params,
}: {
  params: Promise<{ daySlug: string }>;
}) {
  const { daySlug } = await params;
  const { user, program } = await requireProgramAccess();
  const day = await getDayBySlug(program.id, daySlug);

  if (!day) notFound();

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
    select: { lessonId: true },
  });
  const completedLessonIds = new Set(progressRows.map((row) => row.lessonId));

  const daysWithThumbnails = await enrichProgramDaysWithThumbnails(program.days);

  const dayNav = daysWithThumbnails.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    progress: calculateDayProgress(item.lessons, completedLessonIds),
    thumbnailUrl: item.previewThumbnail,
    completed: isDayComplete(item, completedLessonIds),
  }));

  const lessonsWithMedia = await Promise.all(
    day.lessons.map(async (lesson) => {
      const media = lessonHasVideo(lesson) ? await resolveLessonMedia(lesson) : null;

      return {
        ...lesson,
        playbackId: media?.playbackId ?? null,
        playbackToken: media?.playbackToken ?? null,
        thumbnailUrl: media?.thumbnailUrl ?? null,
        completed: completedLessonIds.has(lesson.id),
      };
    }),
  );

  const dayNeighbors = getDayNeighbors(program.days, day.slug);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <DaySidebar days={dayNav} activeSlug={day.slug} />

      <section className="min-w-0 space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Deň programu</p>
          <h1 className="text-3xl font-semibold tracking-tight">{day.title}</h1>
          {day.description ? <p className="text-muted-foreground">{day.description}</p> : null}
        </div>

        {lessonsWithMedia.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Lekcie v tomto dni</CardTitle>
              <CardDescription>Rýchly prehľad s ukážkami videí</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
                {lessonsWithMedia.map((lesson) => (
                  <li key={lesson.id}>
                    <a
                      href={`#lesson-${lesson.id}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                      <LessonThumbnail src={lesson.thumbnailUrl} title={lesson.title} size="sm" />
                      <span className="min-w-0 flex-1 text-sm font-medium">{lesson.title}</span>
                      {lesson.completed ? (
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Dokončené" />
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        {lessonsWithMedia.map((lesson) => (
          <Card key={lesson.id} id={`lesson-${lesson.id}`} className="scroll-mt-6">
            <CardHeader>
              <div className="flex items-start gap-4">
                <LessonThumbnail src={lesson.thumbnailUrl} title={lesson.title} size="md" />
                <div className="min-w-0 space-y-1">
                  <CardTitle>{lesson.title}</CardTitle>
                  {lesson.description ? <CardDescription>{lesson.description}</CardDescription> : null}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {lesson.playbackId ? (
                <MuxVideoPlayer
                  lessonId={lesson.id}
                  playbackId={lesson.playbackId}
                  playbackToken={lesson.playbackToken}
                  title={lesson.title}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                  Video pre túto lekciu ešte nie je pripravené.
                </div>
              )}

              <AttachmentList attachments={lesson.attachments} />
              <LessonProgressToggle lessonId={lesson.id} initialCompleted={lesson.completed} />
            </CardContent>
          </Card>
        ))}

        <LessonNavigation previousDay={dayNeighbors.previousDay} nextDay={dayNeighbors.nextDay} />
      </section>
    </div>
  );
}
