import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const reorderSchema = z.object({
  entity: z.enum(["day", "lesson"]),
  id: z.string(),
  direction: z.enum(["up", "down"]),
});

export async function POST(request: Request) {
  await requireAdmin();
  const body = reorderSchema.parse(await request.json());

  if (body.entity === "day") {
    const day = await prisma.day.findUnique({ where: { id: body.id } });
    if (!day) return NextResponse.json({ error: "Deň neexistuje" }, { status: 404 });

    const siblings = await prisma.day.findMany({
      where: { programId: day.programId },
      orderBy: { order: "asc" },
    });

    const index = siblings.findIndex((item) => item.id === day.id);
    const swapIndex = body.direction === "up" ? index - 1 : index + 1;
    const swapDay = siblings[swapIndex];
    if (!swapDay) return NextResponse.json({ ok: true });

    await prisma.$transaction([
      prisma.day.update({ where: { id: day.id }, data: { order: -1 } }),
      prisma.day.update({ where: { id: swapDay.id }, data: { order: day.order } }),
      prisma.day.update({ where: { id: day.id }, data: { order: swapDay.order } }),
    ]);

    return NextResponse.json({ ok: true });
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: body.id } });
  if (!lesson) return NextResponse.json({ error: "Lekcia neexistuje" }, { status: 404 });

  const siblings = await prisma.lesson.findMany({
    where: { dayId: lesson.dayId },
    orderBy: { order: "asc" },
  });

  const index = siblings.findIndex((item) => item.id === lesson.id);
  const swapIndex = body.direction === "up" ? index - 1 : index + 1;
  const swapLesson = siblings[swapIndex];
  if (!swapLesson) return NextResponse.json({ ok: true });

  await prisma.$transaction([
    prisma.lesson.update({ where: { id: lesson.id }, data: { order: -1 } }),
    prisma.lesson.update({ where: { id: swapLesson.id }, data: { order: lesson.order } }),
    prisma.lesson.update({ where: { id: lesson.id }, data: { order: swapLesson.order } }),
  ]);

  return NextResponse.json({ ok: true });
}
