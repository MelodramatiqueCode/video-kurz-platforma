import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, resolveUserByEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";

const grantSchema = z.object({
  programId: z.string(),
  email: z.string().email(),
});

export async function POST(request: Request) {
  await requireAdmin();
  const body = grantSchema.parse(await request.json());

  const user = await resolveUserByEmail(body.email);
  if (!user) {
    return NextResponse.json(
      {
        error:
          "Používateľ s týmto emailom sa nenašiel. Najprv sa musí aspoň raz registrovať alebo prihlásiť na webe.",
      },
      { status: 404 },
    );
  }

  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_programId: {
        userId: user.id,
        programId: body.programId,
      },
    },
    update: {
      paidAt: new Date(),
    },
    create: {
      userId: user.id,
      programId: body.programId,
    },
  });

  return NextResponse.json({
    id: enrollment.id,
    email: user.email,
    paidAt: enrollment.paidAt.toISOString(),
    source: enrollment.stripeSessionId ? "stripe" : "manual",
  });
}
