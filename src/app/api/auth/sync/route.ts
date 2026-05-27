import { NextResponse } from "next/server";
import { ensureUserRecord, getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserRecord(user.id, user.email);
  return NextResponse.json({ ok: true });
}
