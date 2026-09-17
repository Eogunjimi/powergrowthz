import { NextRequest, NextResponse } from "next/server";
import { readLocalUpload, mimeForFile } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves locally stored uploads (development fallback when Vercel Blob
 * is not configured). In production with BLOB_READ_WRITE_TOKEN set,
 * files live on Vercel Blob and this route is unused.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { name: string[] } }
) {
  const key = params.name?.join("/") ?? "";
  const buffer = await readLocalUpload(key);
  if (!buffer) {
    return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": mimeForFile(key),
      "Content-Disposition": `inline; filename="${key}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
