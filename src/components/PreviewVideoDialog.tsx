"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PREVIEW_SECONDS = 30;

type PreviewVideoDialogProps = {
  dayTitle: string;
  lessonTitle: string;
  playbackId: string;
  playbackToken?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PreviewVideoDialog({
  dayTitle,
  lessonTitle,
  playbackId,
  playbackToken,
  open,
  onOpenChange,
}: PreviewVideoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [previewEnded, setPreviewEnded] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      setPreviewEnded(false);
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[min(100%,42rem)] max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-2xl backdrop:bg-black/60 open:flex open:flex-col"
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === dialogRef.current) onOpenChange(false);
      }}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-primary">{dayTitle}</p>
          <h3 className="text-lg font-semibold tracking-tight">{lessonTitle}</h3>
          <p className="text-sm text-muted-foreground">Krátka ukážka ({PREVIEW_SECONDS} s)</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 w-9 shrink-0 px-0"
          aria-label="Zavrieť ukážku"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative bg-black">
        <MuxPlayer
          key={`${playbackId}-${open ? "open" : "closed"}`}
          playbackId={playbackId}
          tokens={playbackToken ? { playback: playbackToken } : undefined}
          metadata={{ video_title: lessonTitle }}
          streamType="on-demand"
          className="aspect-video w-full"
          onTimeUpdate={(event) => {
            const media = event.target as HTMLMediaElement;
            if (media.currentTime >= PREVIEW_SECONDS) {
              media.pause();
              setPreviewEnded(true);
            }
          }}
        />

        {previewEnded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 px-6 text-center text-white">
            <p className="text-lg font-medium">Chcete pokračovať v celom programe?</p>
            <p className="max-w-sm text-sm text-white/80">
              Prihláste sa a získajte plný prístup ku všetkým lekciám a materiálom.
            </p>
            <Button asChild>
              <Link href="/prihlasenie">Prihlásiť sa a získať prístup</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
