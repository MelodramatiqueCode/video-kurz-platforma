import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createDirectUpload } from "@/lib/mux";

export async function POST() {
  await requireAdmin();

  try {
    const upload = await createDirectUpload();
    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mux upload failed" },
      { status: 500 },
    );
  }
}
