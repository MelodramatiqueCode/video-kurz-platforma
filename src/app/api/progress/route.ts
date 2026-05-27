import { NextResponse } from "next/server";
import { z } from "zod";
import { getEnrollmentContext } from "@/lib/auth";
import { prisma } from "@/lib/db";

const progressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean(),
});

export async function POST(request: Request) {
  const context = await getEnrollmentContext();
  if (!context) {
    return NextResponse.json({ error: "Nemáte prístup k programu" }, { status: 401 });
  }

  const { user } = context;

  const body = progressSchema.parse(await request.json());

  const lesson = await prisma.lesson.findUnique({
    where: { id: body.lessonId },
    include: { day: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lekcia neexistuje" }, { status: 404 });
  }

  if (body.completed) {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: body.lessonId,
        },
      },
      update: { completedAt: new Date() },
      create: {
        userId: user.id,
        lessonId: body.lessonId,
      },
    });
  } else {
    await prisma.lessonProgress.deleteMany({
      where: {
        userId: user.id,
        lessonId: body.lessonId,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
