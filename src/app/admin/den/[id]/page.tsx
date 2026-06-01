import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminAttachmentUpload } from "@/components/AdminAttachmentUpload";
import { AdminLessonEdit } from "@/components/AdminLessonEdit";
import { AdminLessonForm } from "@/components/AdminLessonForm";
import { AdminVideoUpload } from "@/components/AdminVideoUpload";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

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

  const nextOrder = day.lessons.length + 1;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/admin" className="text-sm text-zinc-600 underline">
          Späť na admin
        </Link>
        <h1 className="text-3xl font-semibold">{day.title}</h1>
        <p className="text-zinc-600">{day.description ?? day.program.title}</p>
      </div>

      <AdminLessonForm dayId={day.id} nextOrder={nextOrder} />

      <div className="space-y-6">
        {day.lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardTitle>Lekcia {lesson.order}</CardTitle>
              <CardDescription>Upravte názov, popis a poradie lekcie.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminLessonEdit lesson={lesson} />
              <div className="flex flex-wrap gap-2">
                {lesson.muxPlaybackId ? (
                  <Badge>Video pripravené</Badge>
                ) : (
                  <Badge>Video chýba</Badge>
                )}
                <Badge>{lesson.attachments.length} súborov</Badge>
              </div>
              <AdminVideoUpload lessonId={lesson.id} />
              <AdminAttachmentUpload lessonId={lesson.id} />
              {lesson.attachments.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {lesson.attachments.map((attachment) => (
                    <li key={attachment.id} className="rounded-lg border border-zinc-200 px-3 py-2">
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
