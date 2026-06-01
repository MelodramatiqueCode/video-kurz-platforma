import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { getCurrentUser, getEnrollmentContext } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, "blob-download", 120, 60_000);
  if (limited) return limited;

  const context = await getEnrollmentContext();
  const user = await getCurrentUser();
  const isAdmin = isAdminEmail(user?.email);

  if (!context && !isAdmin) {
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
