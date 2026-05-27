import Link from "next/link";
import { DaySidebar } from "@/components/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { requireEnrollment } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  calculateDayProgress,
  calculateProgramProgress,
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

  const dayNav = program.days.map((day) => ({
    id: day.id,
    title: day.title,
    slug: day.slug,
    progress: calculateDayProgress(day.lessons, completedLessonIds),
  }));

  const firstDay = program.days[0];

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
          {program.days.map((day) => {
            const dayProgress = calculateDayProgress(day.lessons, completedLessonIds);
            return (
              <Card key={day.id}>
                <CardHeader>
                  <CardTitle>{day.title}</CardTitle>
                  <CardDescription>{day.description ?? `${day.lessons.length} lekcií`}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={dayProgress} />
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
