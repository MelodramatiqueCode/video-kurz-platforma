import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getMux } from "@/lib/mux";

const createLessonSchema = z.object({
  dayId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
});

const updateLessonSchema = z.object({
  lessonId: z.string(),
  muxUploadId: z.string(),
});

const editLessonSchema = z.object({
  lessonId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
});

export async function POST(request: Request) {
  await requireAdmin();
  const body = createLessonSchema.parse(await request.json());

  const lesson = await prisma.lesson.create({
    data: {
      dayId: body.dayId,
      title: body.title,
      description: body.description,
      order: body.order,
    },
  });

  return NextResponse.json(lesson);
}

export async function PUT(request: Request) {
  await requireAdmin();

  try {
    const body = editLessonSchema.parse(await request.json());

    const lesson = await prisma.lesson.update({
      where: { id: body.lessonId },
      data: {
        title: body.title,
        description: body.description || null,
        order: body.order,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Poradie je už obsadené inou lekciou v tomto dni." },
        { status: 409 },
      );
    }

    throw error;
  }
}

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = updateLessonSchema.parse(await request.json());

  const mux = getMux();
  const upload = await mux.video.uploads.retrieve(body.muxUploadId);
  const assetId = upload.asset_id;

  if (!assetId) {
    return NextResponse.json({ error: "Video sa ešte spracováva" }, { status: 409 });
  }

  const asset = await mux.video.assets.retrieve(assetId);
  const playbackId = asset.playback_ids?.[0]?.id ?? null;

  const lesson = await prisma.lesson.update({
    where: { id: body.lessonId },
    data: {
      muxAssetId: assetId,
      muxPlaybackId: playbackId,
    },
  });

  return NextResponse.json(lesson);
}
