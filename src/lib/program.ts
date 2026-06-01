import { prisma } from "@/lib/db";

export async function getPublishedProgram() {
  return prisma.program.findFirst({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { attachments: true },
          },
        },
      },
    },
  });
}

export async function getProgramBySlug(slug: string) {
  return prisma.program.findUnique({
    where: { slug },
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { attachments: true },
          },
        },
      },
    },
  });
}

export async function getDayBySlug(programId: string, daySlug: string) {
  return prisma.day.findFirst({
    where: { programId, slug: daySlug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { attachments: true },
      },
    },
  });
}

export function calculateProgramProgress(
  lessonIds: string[],
  completedLessonIds: Set<string>,
) {
  if (lessonIds.length === 0) return 0;
  const completed = lessonIds.filter((id) => completedLessonIds.has(id)).length;
  return Math.round((completed / lessonIds.length) * 100);
}

export function calculateDayProgress(
  lessons: { id: string }[],
  completedLessonIds: Set<string>,
) {
  if (lessons.length === 0) return 0;
  const completed = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  return Math.round((completed / lessons.length) * 100);
}

export function lessonHasVideo(lesson: {
  muxAssetId?: string | null;
  muxPlaybackId?: string | null;
}) {
  return Boolean(lesson.muxAssetId || lesson.muxPlaybackId);
}

export function countLessonsWithVideo(
  lessons: { muxAssetId?: string | null; muxPlaybackId?: string | null }[],
) {
  return lessons.filter(lessonHasVideo).length;
}
