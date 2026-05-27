import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const updateProgramSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  priceCents: z.number().int().nonnegative(),
  stripePriceId: z.string().nullable().optional(),
  published: z.boolean(),
});

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = updateProgramSchema.parse(await request.json());

  const program = await prisma.program.update({
    where: { id: body.id },
    data: {
      title: body.title,
      description: body.description,
      priceCents: body.priceCents,
      stripePriceId: body.stripePriceId,
      published: body.published,
    },
  });

  return NextResponse.json(program);
}
