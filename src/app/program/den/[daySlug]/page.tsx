import { notFound } from "next/navigation";
import { AttachmentList } from "@/components/AttachmentList";
import { DaySidebar } from "@/components/AppHeader";
import { LessonProgressToggle } from "@/components/LessonProgressToggle";
import { MuxVideoPlayer } from "@/components/MuxVideoPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireEnrollment } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createSignedPlaybackToken } from "@/lib/mux";
import { calculateDayProgress, getDayBySlug } from "@/lib/program";

export const dynamic = "force-dynamic";

export default async function DayPage({
  params,
}: {
  params: Promise<{ daySlug: string }>;
}) {
  const { daySlug } = await params;
  const { user, program } = await requireEnrollment();
  const day = await getDayBySlug(program.id, daySlug);

  if (!day) notFound();

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
    select: { lessonId: true },
  });
  const completedLessonIds = new Set(progressRows.map((row) => row.lessonId));

  const dayNav = program.days.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    progress: calculateDayProgress(item.lessons, completedLessonIds),
  }));

  const lessonsWithTokens = await Promise.all(
    day.lessons.map(async (lesson) => {
      const playbackToken =
        lesson.muxPlaybackId && process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET
          ? await createSignedPlaybackToken(lesson.muxPlaybackId)
          : null;

      return {
        ...lesson,
        playbackToken,
        completed: completedLessonIds.has(lesson.id),
      };
    }),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <DaySidebar days={dayNav} activeSlug={day.slug} />

      <section className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{day.title}</h1>
          {day.description ? <p className="text-zinc-600">{day.description}</p> : null}
        </div>

        {lessonsWithTokens.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              {lesson.description ? <CardDescription>{lesson.description}</CardDescription> : null}
            </CardHeader>
            <CardContent className="space-y-6">
              {lesson.muxPlaybackId && lesson.playbackToken ? (
                <MuxVideoPlayer
                  playbackId={lesson.muxPlaybackId}
                  playbackToken={lesson.playbackToken}
                  title={lesson.title}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500">
                  Video pre túto lekciu ešte nie je pripravené.
                </div>
              )}

              <AttachmentList attachments={lesson.attachments} />
              <LessonProgressToggle lessonId={lesson.id} initialCompleted={lesson.completed} />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
