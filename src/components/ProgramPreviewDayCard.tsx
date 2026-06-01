"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { PreviewVideoDialog } from "@/components/PreviewVideoDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLessonCount } from "@/lib/utils";

type PreviewVideo = {
  lessonTitle: string;
  playbackId: string;
  playbackToken?: string | null;
  thumbnailUrl: string;
};

type ProgramPreviewDayCardProps = {
  dayTitle: string;
  description: string | null;
  lessonCount: number;
  lessonTitles: string[];
  previewVideo: PreviewVideo | null;
};

export function ProgramPreviewDayCard({
  dayTitle,
  description,
  lessonCount,
  lessonTitles,
  previewVideo,
}: ProgramPreviewDayCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        {previewVideo ? (
          <button
            type="button"
            className="group relative block w-full border-b border-border p-3 text-left"
            onClick={() => setDialogOpen(true)}
            aria-label={`Prehrať ukážku videa: ${dayTitle}`}
          >
            <img
              src={previewVideo.thumbnailUrl}
              alt=""
              className="h-36 w-full rounded-lg border border-border object-cover transition-opacity group-hover:opacity-90"
              style={{ objectPosition: "center 35%" }}
              loading="lazy"
            />
            <span className="absolute inset-3 flex items-center justify-center rounded-lg bg-black/25 opacity-100 transition group-hover:bg-black/35">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Play className="ml-1 h-6 w-6 fill-current" />
              </span>
            </span>
            <span className="absolute bottom-5 left-5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
              Krátka ukážka
            </span>
          </button>
        ) : null}

        <CardHeader>
          <CardTitle>{dayTitle}</CardTitle>
          <CardDescription>{description ?? formatLessonCount(lessonCount)}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {lessonTitles.map((title, index) => (
              <li key={`${title}-${index}`}>{title}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {previewVideo ? (
        <PreviewVideoDialog
          dayTitle={dayTitle}
          lessonTitle={previewVideo.lessonTitle}
          playbackId={previewVideo.playbackId}
          playbackToken={previewVideo.playbackToken}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      ) : null}
    </>
  );
}
