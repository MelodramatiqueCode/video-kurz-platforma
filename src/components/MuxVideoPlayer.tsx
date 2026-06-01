"use client";

import MuxPlayer from "@mux/mux-player-react";

function storageKey(lessonId: string) {
  return `video-progress:${lessonId}`;
}

export function MuxVideoPlayer({
  lessonId,
  playbackId,
  playbackToken,
  title,
}: {
  lessonId: string;
  playbackId: string;
  playbackToken?: string | null;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black">
      <MuxPlayer
        playbackId={playbackId}
        tokens={playbackToken ? { playback: playbackToken } : undefined}
        metadata={{ video_title: title }}
        streamType="on-demand"
        className="aspect-video w-full"
        onLoadedMetadata={(event) => {
          const media = event.target as HTMLMediaElement;
          const saved = localStorage.getItem(storageKey(lessonId));
          if (!saved) return;
          const time = Number(saved);
          if (Number.isFinite(time) && time > 5) {
            media.currentTime = time;
          }
        }}
        onTimeUpdate={(event) => {
          const media = event.target as HTMLMediaElement;
          if (media.currentTime > 5 && !media.ended) {
            localStorage.setItem(storageKey(lessonId), String(Math.floor(media.currentTime)));
          }
        }}
      />
    </div>
  );
}
