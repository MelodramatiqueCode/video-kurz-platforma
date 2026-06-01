import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminAttachmentUpload } from "@/components/AdminAttachmentUpload";
import { AdminDayEdit } from "@/components/AdminDayEdit";
import { AdminLessonEdit } from "@/components/AdminLessonEdit";
import { AdminLessonForm } from "@/components/AdminLessonForm";
import { AdminPreviewLink } from "@/components/AdminPreviewLink";
import { AdminVideoUpload } from "@/components/AdminVideoUpload";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { MuxVideoStatusBadge } from "@/components/MuxVideoStatusBadge";
import { ReorderButtons } from "@/components/ReorderButtons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getMuxAssetStatus } from "@/lib/mux";
import { enrichLessonsWithThumbnails } from "@/lib/program";

export const dynamic = "force-dynamic";

export default async function AdminDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const day = await prisma.day.findUnique({
    where: { id },
    include: {
      program: true,
      lessons: {
        orderBy: { order: "asc" },
        include: { attachments: true },
      },
    },
  });

  if (!day) notFound();

  const lessonsWithThumbnails = await Promise.all(
    (await enrichLessonsWithThumbnails(day.lessons)).map(async (lesson) => ({
      ...lesson,
      muxStatus: await getMuxAssetStatus(lesson.muxAssetId),
    })),
  );
  const nextOrder = day.lessons.length + 1;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/admin" className="text-sm text-muted-foreground underline">
          Späť na admin
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{day.title}</h1>
          <AdminPreviewLink daySlug={day.slug} />
        </div>
        <p className="text-muted-foreground">{day.description ?? day.program.title}</p>
      </div>

      <AdminDayEdit day={day} lessonCount={day.lessons.length} showManageLink={false} />

      <AdminLessonForm dayId={day.id} nextOrder={nextOrder} />

      <div className="space-y-6">
        {lessonsWithThumbnails.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Lekcia {lesson.order}</CardTitle>
                  <CardDescription>Upravte názov, popis a poradie lekcie.</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <MuxVideoStatusBadge status={lesson.muxStatus} />
                  <ReorderButtons entity="lesson" id={lesson.id} />
                  <AdminPreviewLink daySlug={day.slug} lessonId={lesson.id} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson.thumbnailUrl ? (
                <LessonThumbnail
                  src={lesson.thumbnailUrl}
                  title={lesson.title}
                  size="lg"
                  variant="admin"
                />
              ) : null}
              <AdminLessonEdit lesson={lesson} />
              <div className="flex flex-wrap gap-2">
                <Badge>{lesson.attachments.length} súborov</Badge>
              </div>
              <AdminVideoUpload lessonId={lesson.id} />
              <AdminAttachmentUpload lessonId={lesson.id} />
              {lesson.attachments.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {lesson.attachments.map((attachment) => (
                    <li key={attachment.id} className="rounded-lg border border-border px-3 py-2">
                      {attachment.filename} · {attachment.type}
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
