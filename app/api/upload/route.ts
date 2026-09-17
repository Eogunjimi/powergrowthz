import { NextRequest, NextResponse } from "next/server";
import { storeUpload, UploadError } from "@/lib/upload";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`upload:${ip}`, 40, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many uploads. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid upload request." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const kindRaw = formData.get("kind");
  const kind: "image" | "document" = kindRaw === "document" ? "document" : "image";

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "No file was received." },
      { status: 400 }
    );
  }

  try {
    const stored = await storeUpload(file, kind);
    return NextResponse.json({ ok: true, file: stored });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    }
    console.error("[upload] Failed:", err);
    return NextResponse.json(
      { ok: false, error: "The file could not be uploaded. Please try again." },
      { status: 500 }
    );
  }
}
