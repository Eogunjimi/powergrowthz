import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Upload storage abstraction.
 *
 * - Production (Vercel): set BLOB_READ_WRITE_TOKEN to use Vercel Blob.
 *   Swapping in UploadThing / Cloudinary only requires replacing `uploadToBlob`
 *   with the equivalent provider call — the rest of the app is unaffected.
 * - Development fallback: files are written to `.uploads/` and served by
 *   `/api/uploads/[...name]`.
 */

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file

export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const DOCUMENT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

export function isAllowedType(mime: string, kind: "image" | "document") {
  const allowed = kind === "image" ? IMAGE_MIME_TYPES : DOCUMENT_MIME_TYPES;
  return allowed.includes(mime);
}

export function safeFileName(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_")
      .slice(-80) || "file"
  );
}

async function uploadToBlob(
  file: File,
  token: string
): Promise<{ url: string }> {
  // Dynamic import so the dependency is only loaded when configured.
  const { put } = await import("@vercel/blob");
  const ext = EXT_BY_MIME[file.type] ?? path.extname(safeFileName(file.name));
  const blob = await put(`onboarding/${Date.now()}-${randomUUID()}${ext}`, file, {
    access: "public",
    token,
    contentType: file.type || "application/octet-stream",
    addRandomSuffix: false,
  });
  return { url: blob.url };
}

async function uploadToLocal(file: File): Promise<{ url: string }> {
  const ext = EXT_BY_MIME[file.type] ?? path.extname(safeFileName(file.name));
  const key = `${Date.now()}-${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), ".uploads");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, key), buffer);
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return { url: `${base}/api/uploads/${key}` };
}

/**
 * Persist an uploaded file and return a URL the PowerGrowthz team can open.
 */
export async function storeUpload(
  file: File,
  kind: "image" | "document"
): Promise<{ url: string; name: string; size: number; type: string }> {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new UploadError("File is too large. The maximum size is 10 MB.");
  }
  if (!isAllowedType(file.type, kind)) {
    throw new UploadError(
      kind === "image"
        ? "Only JPG, JPEG, PNG and WEBP images are allowed."
        : "Only PDF, JPG, JPEG, PNG and WEBP files are allowed."
    );
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const { url } = token ? await uploadToBlob(file, token) : await uploadToLocal(file);

  return {
    url,
    name: safeFileName(file.name),
    size: file.size,
    type: file.type,
  };
}

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

/** Read a locally stored upload (dev fallback serving route). */
export async function readLocalUpload(key: string): Promise<Buffer | null> {
  const { readFile } = await import("fs/promises");
  // Prevent path traversal.
  if (!/^[a-zA-Z0-9._-]+$/.test(key) || key.includes("..")) return null;
  try {
    return await readFile(path.join(process.cwd(), ".uploads", key));
  } catch {
    return null;
  }
}

export function mimeForFile(key: string): string {
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".webp")) return "image/webp";
  if (key.endsWith(".pdf")) return "application/pdf";
  return "image/jpeg";
}
