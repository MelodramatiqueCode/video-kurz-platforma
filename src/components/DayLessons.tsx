"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AttachmentList } from "@/components/AttachmentList";
import { LessonProgressToggle } from "@/components/LessonProgressToggle";
import { LessonThumbnail } from "@/components/LessonThumbnail";
import { MuxVideoPlayer } from "@/components/MuxVideoPlayer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type DayLessonItem = {
  id: string;
  title: string;
  description: string | null;
  playbackId: string | null;
  playbackToken: string | null;
  thumbnailUrl: string | null;
  completed: boolean;
  attachments: {
    id: string;
    filename: string;
    type: "ATTACHMENT" | "WORKBOOK";
  }[];
};

function LessonBody({ lesson }: { lesson: DayLessonItem }) {
  return (
    <div className="space-y-6">
      {lesson.playbackId ? (
        <MuxVideoPlayer
          lessonId={lesson.id}
          playbackId={lesson.playbackId}
          playbackToken={lesson.playbackToken}
          title={lesson.title}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Video pre túto lekciu ešte nie je pripravené.
        </div>
      )}

      <AttachmentList attachments={lesson.attachments} />
      <LessonProgressToggle lessonId={lesson.id} initialCompleted={lesson.completed} />
    </div>
  );
}

export function DayLessons({ lessons }: { lessons: DayLessonItem[] }) {
  const defaultOpenId = lessons.find((lesson) => !lesson.completed)?.id ?? lessons[0]?.id ?? null;
  const [openLessonId, setOpenLessonId] = useState<string | null>(defaultOpenId);

  if (lessons.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-2 lg:hidden">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lekcie</p>
        {lessons.map((lesson) => {
          const isOpen = openLessonId === lesson.id;

          return (
            <div key={lesson.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenLessonId(isOpen ? null : lesson.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <LessonThumbnail src={lesson.thumbnailUrl} title={lesson.title} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{lesson.title}</p>
                  {lesson.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{lesson.description}</p>
                  ) : null}
                </div>
                {lesson.completed ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Dokončené" />
                ) : null}
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                />
              </button>

              {isOpen ? (
                <div className="space-y-6 border-t border-border px-4 py-4">
                  <LessonBody lesson={lesson} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="hidden space-y-8 lg:block">
        {lessons.map((lesson) => (
          <Card key={lesson.id} id={`lesson-${lesson.id}`} className="scroll-mt-6">
            <CardHeader>
              <div className="flex items-start gap-4">
                <LessonThumbnail src={lesson.thumbnailUrl} title={lesson.title} size="md" />
                <div className="min-w-0 space-y-1">
                  <CardTitle>{lesson.title}</CardTitle>
                  {lesson.description ? <CardDescription>{lesson.description}</CardDescription> : null}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LessonBody lesson={lesson} />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
