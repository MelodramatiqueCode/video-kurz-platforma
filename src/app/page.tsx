import Link from "next/link";
import { BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { BrandLogoLarge } from "@/components/BrandLogo";
import { BuyButton } from "@/components/BuyButton";
import { FaqSection } from "@/components/FaqSection";
import { ProgramPreviewSection } from "@/components/ProgramPreviewSection";
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

  const totalLessons = program.days.reduce((count, day) => count + day.lessons.length, 0);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-accent/80 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <section className="space-y-8">
            <div className="space-y-4">
              <BrandLogoLarge />
              <p className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Mamy mimo davu
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {program.title}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {program.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/80">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{program.days.length} dní</CardTitle>
                  <CardDescription>Obsah rozdelený po dňoch</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/80">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{totalLessons} lekcií</CardTitle>
                  <CardDescription>Videá, prílohy a pracovné zošity</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/80">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Vlastné tempo</CardTitle>
                  <CardDescription>Sledujte postup po dokončení lekcií</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {params.needsPurchase ? (
              <p className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--warning)", background: "var(--warning-bg)", color: "var(--warning)" }}>
                Pre vstup do programu je potrebné dokončiť nákup.
              </p>
            ) : null}

            {params.success ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Platba prebehla úspešne. Môžete pokračovať do programu.
              </p>
            ) : null}
          </section>

          <Card className="sticky top-24 border-primary/15 shadow-lg shadow-primary/5 lg:top-28">
            <CardHeader>
              <CardTitle>Získajte prístup</CardTitle>
              <CardDescription>Jednorazová platba, celý program naraz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-4xl font-semibold tracking-tight">{formatPrice(program.priceCents, program.currency)}</p>
                <p className="mt-1 text-sm text-muted-foreground">Doživotný prístup k obsahu programu</p>
              </div>
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

        <div className="mt-16 space-y-16">
          <ProgramPreviewSection program={program} />
          <FaqSection />
        </div>
      </div>
    </div>
  );
}
