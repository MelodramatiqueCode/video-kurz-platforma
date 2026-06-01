import { AdminDayEdit } from "@/components/AdminDayEdit";
import { AdminDayForm } from "@/components/AdminDayForm";
import { AdminGrantEnrollment } from "@/components/AdminGrantEnrollment";
import { AdminProgramSettings } from "@/components/AdminProgramSettings";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { VideoCountBadge } from "@/components/VideoStatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { countLessonsWithVideo, enrichProgramDaysWithThumbnails } from "@/lib/program";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let program = await prisma.program.findFirst({
    include: {
      days: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
              muxAssetId: true,
              muxPlaybackId: true,
            },
          },
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
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                order: true,
                muxAssetId: true,
                muxPlaybackId: true,
              },
            },
          },
        },
      },
    });
  }

  const daysWithThumbnails = await enrichProgramDaysWithThumbnails(program.days);
  const nextOrder = program.days.length + 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="text-zinc-600">Správa programu, dní, lekcií a prístupov.</p>
      </div>

      <AdminProgramSettings program={program} />

      {!program.published ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Program nie je publikovaný</CardTitle>
            <CardDescription className="text-amber-900">
              Na úvodnej stránke sa zobrazí len informácia o nepublikovanom programe. Zaškrtnite
              „Publikované“ v nastaveniach programu a uložte zmeny.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <AdminGrantEnrollment programId={program.id} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Dni programu</h2>
          {daysWithThumbnails.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Zatiaľ žiadne dni</CardTitle>
                <CardDescription>Pridajte prvý deň programu.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            daysWithThumbnails.map((day) => {
              const videosReady = countLessonsWithVideo(day.lessons);

              return (
                <Card key={day.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>Deň {day.order}</CardTitle>
                      <VideoCountBadge ready={videosReady} total={day.lessons.length} />
                    </div>
                    <CardDescription>{day.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {day.previewThumbnail ? (
                      <LessonThumbnail
                        src={day.previewThumbnail}
                        title={day.title}
                        size="lg"
                        variant="admin"
                      />
                    ) : null}
                    {day.lessons.length > 0 ? (
                      <ul className="space-y-3 rounded-lg border border-zinc-200 p-3 text-sm">
                        {day.lessons.map((lesson) => (
                          <li key={lesson.id} className="flex items-center gap-3">
                            <LessonThumbnail
                              src={lesson.thumbnailUrl}
                              title={lesson.title}
                              size="sm"
                              variant="admin"
                            />
                            <span className="min-w-0 flex-1">
                              {lesson.order}. {lesson.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <AdminDayEdit day={day} lessonCount={day.lessons.length} />
                  </CardContent>
                </Card>
              );
            })
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
