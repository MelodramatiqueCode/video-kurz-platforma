import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureUserRecord, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const grantSchema = z.object({
  programId: z.string(),
  email: z.string().email(),
});

export async function POST(request: Request) {
  await requireAdmin();
  const body = grantSchema.parse(await request.json());

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) {
    return NextResponse.json(
      { error: "Používateľ s týmto emailom ešte neexistuje. Najprv sa musí registrovať." },
      { status: 404 },
    );
  }

  await ensureUserRecord(user.id, user.email);

  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_programId: {
        userId: user.id,
        programId: body.programId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      programId: body.programId,
    },
  });

  return NextResponse.json(enrollment);
}
