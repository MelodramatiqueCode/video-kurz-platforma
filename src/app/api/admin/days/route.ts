import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const createDaySchema = z.object({
  programId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
});

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
