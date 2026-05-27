import Mux from "@mux/mux-node";

let muxClient: Mux | null = null;

export function getMux() {
  if (!muxClient) {
    const tokenId = process.env.MUX_TOKEN_ID;
    const tokenSecret = process.env.MUX_TOKEN_SECRET;

    if (!tokenId || !tokenSecret) {
      throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must be configured");
    }

    muxClient = new Mux({ tokenId, tokenSecret });
  }

  return muxClient;
}

export async function createSignedPlaybackToken(playbackId: string) {
  const mux = getMux();
  return mux.jwt.signPlaybackId(playbackId, {
    expiration: "1h",
    type: "video",
  });
}

export async function createDirectUpload() {
  const mux = getMux();
  return mux.video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    new_asset_settings: {
      playback_policy: ["signed"],
    },
  });
}
