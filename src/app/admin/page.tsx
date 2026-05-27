import Link from "next/link";
import { AdminDayForm } from "@/components/AdminDayForm";
import { AdminGrantEnrollment } from "@/components/AdminGrantEnrollment";
import { AdminProgramSettings } from "@/components/AdminProgramSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let program = await prisma.program.findFirst({
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!program) {
    program = await prisma.program.create({
      data: {
        title: "Môj video program",
        slug: "moj-video-program",
        description: "Denný video program s pracovnými zošitmi.",
        priceCents: 9900,
        published: false,
      },
      include: {
        days: {
          orderBy: { order: "asc" },
          include: {
            _count: { select: { lessons: true } },
          },
        },
      },
    });
  }

  const nextOrder = program.days.length + 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="text-zinc-600">Správa programu, dní, lekcií a prístupov.</p>
      </div>

      <AdminProgramSettings program={program} />
      <AdminGrantEnrollment programId={program.id} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Dni programu</h2>
          {program.days.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Zatiaľ žiadne dni</CardTitle>
                <CardDescription>Pridajte prvý deň programu.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            program.days.map((day) => (
              <Card key={day.id}>
                <CardHeader>
                  <CardTitle>{day.title}</CardTitle>
                  <CardDescription>
                    {day._count.lessons} lekcií · poradie {day.order}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/admin/den/${day.id}`} className="font-medium underline">
                    Upraviť deň
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <AdminDayForm programId={program.id} nextOrder={nextOrder} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktuálna cena</CardTitle>
          <CardDescription>{formatPrice(program.priceCents, program.currency)}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
