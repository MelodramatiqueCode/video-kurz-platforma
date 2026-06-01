"use client";

import MuxPlayer from "@mux/mux-player-react";

export function MuxVideoPlayer({
  playbackId,
  playbackToken,
  title,
}: {
  playbackId: string;
  playbackToken?: string | null;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-black">
      <MuxPlayer
        playbackId={playbackId}
        tokens={playbackToken ? { playback: playbackToken } : undefined}
        metadata={{ video_title: title }}
        streamType="on-demand"
        className="aspect-video w-full"
      />
    </div>
  );
}
