import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendPurchaseConfirmationEmail } from "@/lib/email";
import { getAppUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET missing" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const programId = session.metadata?.programId;
    const userId = session.metadata?.userId;
    const email = session.customer_details?.email ?? session.customer_email;

    if (programId && userId && email) {
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
    }
  }

  return NextResponse.json({ received: true });
}
