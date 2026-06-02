import { ensureUserRecord } from "@/lib/auth";
import { sendPurchaseConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/db";
import { getAppUrl, getStripe } from "@/lib/stripe";

export async function fulfillCheckoutSession(sessionId: string, expectedUserId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { ok: false as const, reason: "unpaid" as const };
  }

  const programId = session.metadata?.programId;
  const userId = session.metadata?.userId;
  const email = session.customer_details?.email ?? session.customer_email ?? undefined;

  if (!programId || !userId || userId !== expectedUserId || !email) {
    return { ok: false as const, reason: "invalid_session" as const };
  }

  await ensureUserRecord(userId, email);
  await prisma.enrollment.upsert({
    where: {
      userId_programId: {
        userId,
        programId,
      },
    },
    update: {
      stripeSessionId: session.id,
      paidAt: new Date(),
    },
    create: {
      userId,
      programId,
      stripeSessionId: session.id,
    },
  });

  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (program) {
    await sendPurchaseConfirmationEmail({
      to: email,
      programTitle: program.title,
      programUrl: `${getAppUrl()}/program`,
    });
  }

  return { ok: true as const };
}
