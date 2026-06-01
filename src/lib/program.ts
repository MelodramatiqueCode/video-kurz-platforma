import { prisma } from "@/lib/db";
import { resolveLessonThumbnail } from "@/lib/mux";

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

type LessonWithMux = {
  id: string;
  title: string;
  muxAssetId: string | null;
  muxPlaybackId: string | null;
};

export type LessonWithThumbnail = LessonWithMux & {
  thumbnailUrl: string | null;
};

export type DayWithThumbnails<T extends { lessons: LessonWithMux[] }> = Omit<T, "lessons"> & {
  lessons: Array<T["lessons"][number] & { thumbnailUrl: string | null }>;
  previewThumbnail: string | null;
};

export async function enrichLessonsWithThumbnails<T extends LessonWithMux>(
  lessons: T[],
): Promise<Array<T & { thumbnailUrl: string | null }>> {
  return Promise.all(
    lessons.map(async (lesson) => ({
      ...lesson,
      thumbnailUrl: lessonHasVideo(lesson) ? await resolveLessonThumbnail(lesson) : null,
    })),
  );
}

export async function enrichProgramDaysWithThumbnails<
  T extends {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    lessons: LessonWithMux[];
  },
>(days: T[]): Promise<Array<DayWithThumbnails<T>>> {
  return Promise.all(
    days.map(async (day) => {
      const lessons = await enrichLessonsWithThumbnails(day.lessons);
      const previewLesson = lessons.find((lesson) => lesson.thumbnailUrl);

      return {
        ...day,
        lessons,
        previewThumbnail: previewLesson?.thumbnailUrl ?? null,
      };
    }),
  );
}

type OrderedDay = {
  id: string;
  title: string;
  slug: string;
  lessons: { id: string; title: string }[];
};

export function isDayComplete(day: { lessons: { id: string }[] }, completedLessonIds: Set<string>) {
  if (day.lessons.length === 0) return false;
  return day.lessons.every((lesson) => completedLessonIds.has(lesson.id));
}

export function findContinueLesson(days: OrderedDay[], completedLessonIds: Set<string>) {
  for (const day of days) {
    for (const lesson of day.lessons) {
      if (!completedLessonIds.has(lesson.id)) {
        return {
          daySlug: day.slug,
          dayTitle: day.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        };
      }
    }
  }

  return null;
}

export function getDayNeighbors(days: OrderedDay[], currentDaySlug: string) {
  const index = days.findIndex((day) => day.slug === currentDaySlug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous:
      index > 0
        ? { slug: days[index - 1].slug, title: days[index - 1].title }
        : null,
    next:
      index < days.length - 1
        ? { slug: days[index + 1].slug, title: days[index + 1].title }
        : null,
  };
}
