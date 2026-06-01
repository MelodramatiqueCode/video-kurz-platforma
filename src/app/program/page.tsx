import Link from "next/link";
import { DaySidebar } from "@/components/AppHeader";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireEnrollment } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  calculateDayProgress,
  calculateProgramProgress,
  enrichProgramDaysWithThumbnails,
} from "@/lib/program";

export const dynamic = "force-dynamic";

export default async function ProgramDashboardPage() {
  const { user, program } = await requireEnrollment();

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
    select: { lessonId: true },
  });
  const completedLessonIds = new Set(progressRows.map((row) => row.lessonId));
  const allLessonIds = program.days.flatMap((day) => day.lessons.map((lesson) => lesson.id));
  const overallProgress = calculateProgramProgress(allLessonIds, completedLessonIds);

  const daysWithThumbnails = await enrichProgramDaysWithThumbnails(program.days);

  const dayNav = daysWithThumbnails.map((day) => ({
    id: day.id,
    title: day.title,
    slug: day.slug,
    progress: calculateDayProgress(day.lessons, completedLessonIds),
    thumbnailUrl: day.previewThumbnail,
  }));

  const firstDay = daysWithThumbnails[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <DaySidebar days={dayNav} />

      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">{program.title}</h1>
          <p className="text-zinc-600">Váš celkový postup v programe</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Celkový progress</CardTitle>
            <CardDescription>{overallProgress}% dokončené</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {daysWithThumbnails.map((day) => {
            const dayProgress = calculateDayProgress(day.lessons, completedLessonIds);

            return (
              <Card key={day.id} className="overflow-hidden">
                {day.previewThumbnail ? (
                  <div className="border-b border-zinc-200 p-3">
                    <LessonThumbnail src={day.previewThumbnail} title={day.title} size="lg" />
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle>{day.title}</CardTitle>
                  <CardDescription>{day.description ?? `${day.lessons.length} lekcií`}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={dayProgress} />
                  {day.lessons.length > 0 ? (
                    <ul className="space-y-3 text-sm">
                      {day.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex items-center gap-3">
                          <LessonThumbnail
                            src={lesson.thumbnailUrl}
                            title={lesson.title}
                            size="sm"
                          />
                          <span className="min-w-0 flex-1">{lesson.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <Link href={`/program/den/${day.slug}`} className="text-sm font-medium underline">
                    Otvoriť deň
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {firstDay ? (
          <Card>
            <CardHeader>
              <CardTitle>Pokračovať</CardTitle>
              <CardDescription>Odporúčame začať prvým dňom programu.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/program/den/${firstDay.slug}`} className="font-medium underline">
                Prejsť na {firstDay.title}
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
