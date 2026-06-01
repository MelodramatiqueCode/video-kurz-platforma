import { notFound, redirect } from "next/navigation";
import { CertificateView } from "@/components/CertificateView";
import { requireProgramAccess } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateProgramProgress } from "@/lib/program";

export const dynamic = "force-dynamic";

export default async function CertificatePage() {
  const { user, program } = await requireProgramAccess();

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
    select: { lessonId: true, completedAt: true },
    orderBy: { completedAt: "desc" },
  });
  const completedLessonIds = new Set(progressRows.map((row) => row.lessonId));
  const allLessonIds = program.days.flatMap((day) => day.lessons.map((lesson) => lesson.id));
  const overallProgress = calculateProgramProgress(allLessonIds, completedLessonIds);

  if (overallProgress < 100) {
    redirect("/program");
  }

  if (!user.email) notFound();

  const completedAt = progressRows[0]?.completedAt ?? new Date();

  return (
    <CertificateView
      programTitle={program.title}
      userEmail={user.email}
      completedAt={completedAt.toLocaleDateString("sk-SK")}
    />
  );
}
