import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMux } from "@/lib/mux";
import { slugify } from "@/lib/utils";

const createDaySchema = z.object({
  programId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
});

const editDaySchema = z.object({
  dayId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
});

const deleteDaySchema = z.object({
  dayId: z.string(),
});

async function deleteLessonMedia(lesson: {
  muxAssetId: string | null;
  attachments: { blobUrl: string }[];
}) {
  if (lesson.muxAssetId) {
    try {
      const mux = getMux();
      await mux.video.assets.delete(lesson.muxAssetId);
    } catch {
      // Video v Muxe môže byť už zmazané.
    }
  }

  if (lesson.attachments.length > 0) {
    try {
      const { del } = await import("@vercel/blob");
      await del(lesson.attachments.map((attachment) => attachment.blobUrl));
    } catch {
      // PDF v Blob storage nemusí existovať.
    }
  }
}

export async function POST(request: Request) {
  await requireAdmin();

  const body = createDaySchema.parse(await request.json());

  const day = await prisma.day.create({
    data: {
      programId: body.programId,
      title: body.title,
      description: body.description,
      order: body.order,
      slug: slugify(body.title),
    },
  });

  return NextResponse.json(day);
}

export async function PUT(request: Request) {
  await requireAdmin();

  try {
    const body = editDaySchema.parse(await request.json());

    const day = await prisma.day.update({
      where: { id: body.dayId },
      data: {
        title: body.title,
        description: body.description || null,
        order: body.order,
        slug: slugify(body.title),
      },
    });

    return NextResponse.json(day);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Poradie alebo URL slug je už obsadený iným dňom." },
        { status: 409 },
      );
    }

    throw error;
  }
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const body = deleteDaySchema.parse(await request.json());

  const day = await prisma.day.findUnique({
    where: { id: body.dayId },
    include: {
      lessons: {
        include: { attachments: true },
      },
    },
  });

  if (!day) {
    return NextResponse.json({ error: "Deň neexistuje" }, { status: 404 });
  }

  for (const lesson of day.lessons) {
    await deleteLessonMedia(lesson);
  }

  await prisma.day.delete({
    where: { id: body.dayId },
  });

  return NextResponse.json({ ok: true });
}
