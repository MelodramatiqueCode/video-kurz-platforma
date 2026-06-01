import Mux from "@mux/mux-node";

let muxClient: Mux | null = null;

export function hasMuxSigningKeys() {
  return Boolean(process.env.MUX_SIGNING_KEY && process.env.MUX_PRIVATE_KEY);
}

export function getMux() {
  if (!muxClient) {
    const tokenId = process.env.MUX_TOKEN_ID;
    const tokenSecret = process.env.MUX_TOKEN_SECRET;

    if (!tokenId || !tokenSecret) {
      throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must be configured");
    }

    muxClient = new Mux({
      tokenId,
      tokenSecret,
      jwtSigningKey: process.env.MUX_SIGNING_KEY ?? undefined,
      jwtPrivateKey: process.env.MUX_PRIVATE_KEY ?? undefined,
    });
  }

  return muxClient;
}

export async function createSignedPlaybackToken(playbackId: string) {
  if (!hasMuxSigningKeys()) return null;

  try {
    const mux = getMux();
    return await mux.jwt.signPlaybackId(playbackId, {
      expiration: "1h",
      type: "video",
    });
  } catch {
    return null;
  }
}

export async function createSignedThumbnailToken(playbackId: string) {
  if (!hasMuxSigningKeys()) return null;

  try {
    const mux = getMux();
    return await mux.jwt.signPlaybackId(playbackId, {
      expiration: "1h",
      type: "thumbnail",
    });
  } catch {
    return null;
  }
}

export function buildThumbnailUrl(playbackId: string, token?: string | null) {
  const params = new URLSearchParams({
    width: "320",
    height: "180",
    fit_mode: "smartcrop",
  });

  if (token) {
    params.set("token", token);
  }

  return `https://image.mux.com/${playbackId}/thumbnail.jpg?${params.toString()}`;
}

export async function resolvePlaybackId(assetId: string) {
  const mux = getMux();
  const asset = await mux.video.assets.retrieve(assetId);

  if (hasMuxSigningKeys()) {
    const signedPlayback = asset.playback_ids?.find((playback) => playback.policy === "signed");
    if (signedPlayback?.id) return signedPlayback.id;

    const created = await mux.video.assets.createPlaybackId(assetId, { policy: "signed" });
    return created.id;
  }

  const existingPublic = asset.playback_ids?.find((playback) => playback.policy === "public");
  if (existingPublic?.id) return existingPublic.id;

  const created = await mux.video.assets.createPlaybackId(assetId, { policy: "public" });
  return created.id;
}

export async function resolveLessonPlayback(lesson: {
  muxAssetId: string | null;
  muxPlaybackId: string | null;
}) {
  if (!lesson.muxAssetId) {
    if (!lesson.muxPlaybackId) return null;

    return {
      playbackId: lesson.muxPlaybackId,
      playbackToken: hasMuxSigningKeys()
        ? await createSignedPlaybackToken(lesson.muxPlaybackId)
        : null,
    };
  }

  const playbackId = await resolvePlaybackId(lesson.muxAssetId);
  if (!playbackId) return null;

  return {
    playbackId,
    playbackToken: hasMuxSigningKeys()
      ? await createSignedPlaybackToken(playbackId)
      : null,
  };
}

export async function resolveLessonMedia(lesson: {
  muxAssetId: string | null;
  muxPlaybackId: string | null;
}) {
  const playback = await resolveLessonPlayback(lesson);
  if (!playback?.playbackId) {
    return {
      playbackId: null,
      playbackToken: null,
      thumbnailUrl: null,
    };
  }

  const thumbnailToken = hasMuxSigningKeys()
    ? await createSignedThumbnailToken(playback.playbackId)
    : null;

  return {
    playbackId: playback.playbackId,
    playbackToken: playback.playbackToken,
    thumbnailUrl: buildThumbnailUrl(playback.playbackId, thumbnailToken),
  };
}

export async function resolveLessonThumbnail(lesson: {
  muxAssetId: string | null;
  muxPlaybackId: string | null;
}) {
  const media = await resolveLessonMedia(lesson);
  return media.thumbnailUrl;
}

export async function createDirectUpload(corsOrigin?: string) {
  const mux = getMux();
  const origin =
    corsOrigin ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  return mux.video.uploads.create({
    cors_origin: origin,
    new_asset_settings: {
      playback_policy: [hasMuxSigningKeys() ? "signed" : "public"],
    },
  });
}

export async function deleteMuxAsset(assetId: string) {
  try {
    const mux = getMux();
    await mux.video.assets.delete(assetId);
  } catch {
    // Asset may already be deleted.
  }
}

export type MuxAssetStatus = "preparing" | "ready" | "errored" | "missing";

export async function getMuxAssetStatus(assetId: string | null): Promise<MuxAssetStatus> {
  if (!assetId) return "missing";

  try {
    const mux = getMux();
    const asset = await mux.video.assets.retrieve(assetId);
    if (asset.status === "ready") return "ready";
    if (asset.status === "errored") return "errored";
    return "preparing";
  } catch {
    return "missing";
  }
}
