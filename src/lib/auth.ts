import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { normalizeProgramDays } from "@/lib/program";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(redirectTo = "/prihlasenie") {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user;
}

export async function ensureUserRecord(userId: string, email: string) {
  return prisma.user.upsert({
    where: { id: userId },
    update: { email },
    create: { id: userId, email },
  });
}

export async function resolveUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
  });
  if (existing) {
    return existing;
  }

  const rows = await prisma.$queryRaw<{ id: string; email: string }[]>`
    SELECT id::text AS id, email
    FROM auth.users
    WHERE lower(email) = ${normalizedEmail}
    LIMIT 1
  `;

  const authUser = rows[0];
  if (!authUser?.email) {
    return null;
  }

  return ensureUserRecord(authUser.id, authUser.email);
}

export async function requireAdmin() {
  const user = await requireUser("/prihlasenie?next=/admin");

  if (!isAdminEmail(user.email)) {
    redirect("/");
  }

  return user;
}

export async function getEnrollmentContext() {
  const user = await getCurrentUser();
  if (!user) return null;

  await ensureUserRecord(user.id, user.email ?? "");

  const program = await prisma.program.findFirst({
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

  if (!program) return null;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_programId: {
        userId: user.id,
        programId: program.id,
      },
    },
  });

  if (!enrollment) return null;

  return { user, program: normalizeProgramDays(program), enrollment };
}

export async function requireEnrollment(programSlug?: string) {
  const user = await requireUser("/prihlasenie?next=/program");
  await ensureUserRecord(user.id, user.email ?? "");

  const programInclude = {
    days: {
      orderBy: { order: "asc" as const },
      include: {
        lessons: {
          orderBy: { order: "asc" as const },
          include: { attachments: true },
        },
      },
    },
  };

  const program = programSlug
    ? await prisma.program.findUnique({ where: { slug: programSlug }, include: programInclude })
    : await prisma.program.findFirst({
        where: { published: true },
        orderBy: { createdAt: "asc" },
        include: programInclude,
      });

  if (!program) redirect("/");

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_programId: {
        userId: user.id,
        programId: program.id,
      },
    },
  });

  if (!enrollment) redirect("/?needsPurchase=1");

  return { user, program: normalizeProgramDays(program), enrollment };
}

export async function requireProgramAccess(programSlug?: string) {
  const user = await requireUser("/prihlasenie?next=/program");
  await ensureUserRecord(user.id, user.email ?? "");

  const programInclude = {
    days: {
      orderBy: { order: "asc" as const },
      include: {
        lessons: {
          orderBy: { order: "asc" as const },
          include: { attachments: true },
        },
      },
    },
  };

  const program = programSlug
    ? await prisma.program.findUnique({ where: { slug: programSlug }, include: programInclude })
    : await prisma.program.findFirst({
        where: { published: true },
        orderBy: { createdAt: "asc" },
        include: programInclude,
      });

  if (!program) redirect("/");

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_programId: {
        userId: user.id,
        programId: program.id,
      },
    },
  });

  const isAdmin = isAdminEmail(user.email);

  if (!enrollment && !isAdmin) redirect("/?needsPurchase=1");

  return {
    user,
    program: normalizeProgramDays(program),
    enrollment,
    isAdminPreview: isAdmin && !enrollment,
  };
}
