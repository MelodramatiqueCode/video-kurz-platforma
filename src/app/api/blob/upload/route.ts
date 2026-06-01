import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "blob-upload", 30, 60_000);
  if (limited) return limited;

  await requireAdmin();

  const formData = await request.formData();
  const file = formData.get("file");
  const lessonId = formData.get("lessonId");
  const type = formData.get("type");

  if (!(file instanceof File) || typeof lessonId !== "string") {
    return NextResponse.json({ error: "Neplatný upload" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Povolené sú len PDF súbory" }, { status: 400 });
  }

  const blob = await put(`attachments/${lessonId}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  const attachment = await prisma.attachment.create({
    data: {
      lessonId,
      filename: file.name,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      type: type === "WORKBOOK" ? "WORKBOOK" : "ATTACHMENT",
    },
  });

  return NextResponse.json(attachment);
}
