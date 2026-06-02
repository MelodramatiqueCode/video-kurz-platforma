"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

type PreviewVideoDialogProps = {
  dayTitle: string;
  lessonTitle: string;
  playbackId: string;
  playbackToken?: string | null;
  startSeconds: number;
  durationSeconds: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PreviewVideoDialog({
  dayTitle,
  lessonTitle,
  playbackId,
  playbackToken,
  startSeconds,
  durationSeconds,
  open,
  onOpenChange,
}: PreviewVideoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [previewEnded, setPreviewEnded] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const previewEndSeconds = startSeconds + durationSeconds;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      setPreviewEnded(false);
      setPlayerError(false);
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
        {open && !playerError ? (
          <MuxPlayer
            key={`${playbackId}-${startSeconds}`}
            playbackId={playbackId}
            tokens={playbackToken ? { playback: playbackToken } : undefined}
            metadata={{ video_title: lessonTitle }}
            streamType="on-demand"
            startTime={startSeconds > 0 ? startSeconds : undefined}
            className="aspect-video w-full"
            onError={() => setPlayerError(true)}
            onTimeUpdate={(event) => {
              const media = event.target as HTMLMediaElement;
              if (media.currentTime >= previewEndSeconds) {
                media.pause();
                setPreviewEnded(true);
              }
            }}
          />
        ) : null}

        {playerError ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 px-6 text-center text-white">
            <p className="text-sm text-white/80">Ukážku sa nepodarilo načítať.</p>
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/prihlasenie">Prihlásiť sa pre plný prístup</Link>
            </Button>
          </div>
        ) : null}

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
