import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getPublishedProgram } from "@/lib/program";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ needsPurchase?: string; success?: string }>;
}) {
  const program = await getPublishedProgram();
  const user = await getCurrentUser();
  const params = await searchParams;

  if (!program) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Program zatiaľ nie je publikovaný</CardTitle>
            <CardDescription>
              Administrátor musí najprv vytvoriť a publikovať program v admin sekcii.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Online program</p>
            <h1 className="text-4xl font-semibold tracking-tight">{program.title}</h1>
            <p className="text-lg text-zinc-600">{program.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{program.days.length} dní</CardTitle>
                <CardDescription>Obsah rozdelený po dňoch</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Videá + PDF</CardTitle>
                <CardDescription>Lekcie, prílohy a pracovné zošity</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progress</CardTitle>
                <CardDescription>Odškrtávajte dokončené lekcie</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {params.needsPurchase ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Pre vstup do programu je potrebné dokončiť nákup.
            </p>
          ) : null}

          {params.success ? (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Platba prebehla úspešne. Môžete pokračovať do programu.
            </p>
          ) : null}
        </section>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Získajte prístup</CardTitle>
            <CardDescription>Jednorazová platba, celý program naraz.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold">{formatPrice(program.priceCents, program.currency)}</p>
            {user ? (
              <>
                <BuyButton programSlug={program.slug} />
                <Button asChild variant="outline" className="w-full">
                  <Link href="/program">Prejsť do programu</Link>
                </Button>
              </>
            ) : (
              <>
                <BuyButton programSlug={program.slug} />
                <Button asChild variant="outline" className="w-full">
                  <Link href="/prihlasenie">Najprv sa prihlásiť</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
