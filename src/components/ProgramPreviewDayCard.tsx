"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { PreviewVideoDialog } from "@/components/PreviewVideoDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLessonCount } from "@/lib/utils";

type PreviewVideo = {
  lessonTitle: string;
  playbackId: string;
  playbackToken?: string | null;
  startSeconds: number;
  durationSeconds: number;
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
      <Card>
        <CardHeader>
          <CardTitle>{dayTitle}</CardTitle>
          <CardDescription>{description ?? formatLessonCount(lessonCount)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {lessonTitles.map((title, index) => (
              <li key={`${title}-${index}`}>{title}</li>
            ))}
          </ul>

          {previewVideo ? (
            <Button type="button" variant="outline" className="w-full" onClick={() => setDialogOpen(true)}>
              <Play className="h-4 w-4 fill-current" />
              Prehrať krátku ukážku
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {previewVideo ? (
        <PreviewVideoDialog
          dayTitle={dayTitle}
          lessonTitle={previewVideo.lessonTitle}
          playbackId={previewVideo.playbackId}
          playbackToken={previewVideo.playbackToken}
          startSeconds={previewVideo.startSeconds}
          durationSeconds={previewVideo.durationSeconds}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      ) : null}
    </>
  );
}
