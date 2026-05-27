"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminVideoUpload({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus("Pripravujem upload...");

    try {
      const uploadResponse = await fetch("/api/mux/upload", { method: "POST" });
      if (!uploadResponse.ok) throw new Error("Nepodarilo sa vytvoriť upload URL");

      const { uploadUrl, uploadId } = await uploadResponse.json();

      setStatus("Nahrávam video...");
      const putResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "video/mp4" },
      });

      if (!putResponse.ok) throw new Error("Upload videa zlyhal");

      setStatus("Spracovávam video...");
      await fetch("/api/admin/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, muxUploadId: uploadId }),
      });

      setStatus("Video bolo nahraté. Spracovanie môže trvať pár minút.");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload zlyhal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3 rounded-lg border border-zinc-200 p-4">
      <Label htmlFor={`video-${lessonId}`}>Nahrať video</Label>
      <Input
        id={`video-${lessonId}`}
        type="file"
        accept="video/*"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <Button type="submit" disabled={loading || !file}>
        {loading ? "Nahrávam..." : "Nahrať video"}
      </Button>
      {status ? <p className="text-sm text-zinc-600">{status}</p> : null}
    </form>
  );
}
