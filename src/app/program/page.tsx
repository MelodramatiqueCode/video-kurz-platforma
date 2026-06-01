import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DaySidebar } from "@/components/AppHeader";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { Button } from "@/components/ui/button";
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

      <section className="space-y-6 min-w-0">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Váš program</p>
            <h1 className="text-3xl font-semibold tracking-tight">{program.title}</h1>
            <p className="text-muted-foreground">Sledujte svoj celkový postup a pokračujte tam, kde ste skončili.</p>
          </div>

          <Card className="overflow-hidden border-primary/10">
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
                <Card key={day.id} className="group overflow-hidden transition-shadow hover:shadow-md">
                  {day.previewThumbnail ? (
                    <div className="border-b border-border p-3">
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
                    <Button asChild variant="link" className="h-auto p-0">
                      <Link href={`/program/den/${day.slug}`}>
                        Otvoriť deň
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {firstDay ? (
            <Card className="border-primary/15 bg-accent/40">
              <CardHeader>
                <CardTitle>Pokračovať</CardTitle>
                <CardDescription>Odporúčame začať prvým dňom programu.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/program/den/${firstDay.slug}`}>
                    Prejsť na {firstDay.title}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </section>
    </div>
  );
}
