import { NextResponse } from "next/server";
import { getEnrollmentContext } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const context = await getEnrollmentContext();
  if (!context) {
    return NextResponse.json({ error: "Nemáte prístup k programu" }, { status: 401 });
  }

  const attachmentId = new URL(request.url).searchParams.get("id");
  if (!attachmentId) {
    return NextResponse.json({ error: "Chýba ID prílohy" }, { status: 400 });
  }

  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
  });

  if (!attachment) {
    return NextResponse.json({ error: "Príloha neexistuje" }, { status: 404 });
  }

  return NextResponse.redirect(attachment.blobUrl);
}
