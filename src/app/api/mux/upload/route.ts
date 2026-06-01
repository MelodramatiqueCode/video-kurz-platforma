import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createDirectUpload } from "@/lib/mux";

function formatMuxError(error: unknown) {
  const message = error instanceof Error ? error.message : "Mux upload failed";

  if (message.includes("Free plan is limited to 10 assets")) {
    return "Mux free plán umožňuje max. 10 videí. Zmažte staré/nepoužívané videá v Mux dashboarde alebo pri lekciách, prípadne upgradnite plán.";
  }

  return message;
}

export async function POST(request: Request) {
  await requireAdmin();

  try {
    const origin = request.headers.get("origin") ?? undefined;
    const upload = await createDirectUpload(origin);
    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: formatMuxError(error) },
      { status: 500 },
    );
  }
}
