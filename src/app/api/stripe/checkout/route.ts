import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureUserRecord, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAppUrl, getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  programSlug: z.string(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return NextResponse.json(
      { error: "Pre nákup sa musíte prihlásiť alebo registrovať." },
      { status: 401 },
    );
  }

  await ensureUserRecord(user.id, user.email);
  const body = checkoutSchema.parse(await request.json());

  const program = await prisma.program.findUnique({
    where: { slug: body.programSlug, published: true },
  });

  if (!program) {
    return NextResponse.json({ error: "Program nie je dostupný" }, { status: 404 });
  }

  if (!program.stripePriceId) {
    return NextResponse.json(
      { error: "Stripe Price ID nie je nastavené v admin sekcii" },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  const appUrl = getAppUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: program.stripePriceId, quantity: 1 }],
      success_url: `${appUrl}/program?success=1`,
      cancel_url: `${appUrl}/?canceled=1`,
      customer_email: user.email,
      allow_promotion_codes: true,
      metadata: {
        programId: program.id,
        userId: user.id,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe nevrátil platobnú URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nepodarilo sa vytvoriť Stripe checkout.";

    if (message.includes("No such price")) {
      return NextResponse.json(
        {
          error:
            "Stripe Price ID v admin paneli neexistuje v tomto Stripe režime. Vytvorte cenu v Live mode a uložte nové price_... ID.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
