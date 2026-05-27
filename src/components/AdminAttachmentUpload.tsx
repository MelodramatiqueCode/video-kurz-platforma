"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminAttachmentUpload({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"ATTACHMENT" | "WORKBOOK">("WORKBOOK");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", lessonId);
    formData.append("type", type);

    const response = await fetch("/api/blob/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!response.ok) {
      setMessage("Upload PDF zlyhal");
      return;
    }

    setMessage("Súbor bol nahratý.");
    setFile(null);
    router.refresh();
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3 rounded-lg border border-zinc-200 p-4">
      <div className="space-y-2">
        <Label htmlFor={`attachment-${lessonId}`}>Nahrať PDF</Label>
        <Input
          id={`attachment-${lessonId}`}
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`attachment-type-${lessonId}`}>Typ súboru</Label>
        <select
          id={`attachment-type-${lessonId}`}
          className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
          value={type}
          onChange={(event) => setType(event.target.value as "ATTACHMENT" | "WORKBOOK")}
        >
          <option value="WORKBOOK">Pracovný zošit</option>
          <option value="ATTACHMENT">Príloha</option>
        </select>
      </div>
      <Button type="submit" disabled={loading || !file}>
        {loading ? "Nahrávam..." : "Nahrať PDF"}
      </Button>
      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </form>
  );
}
