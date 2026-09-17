"use client";

import {
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import type { UploadedFile } from "@/types/onboarding";

const MAX_SIZE_MB = 10;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({
  label,
  description,
  accept,
  kind,
  multiple = false,
  maxFiles = 1,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  accept: string;
  kind: "image" | "document";
  multiple?: boolean;
  maxFiles?: number;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const remaining = maxFiles - value.length;

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList).slice(0, Math.max(remaining, 0));
    if (files.length === 0) {
      setError(`You can upload a maximum of ${maxFiles} file${maxFiles > 1 ? "s" : ""}.`);
      return;
    }

    const tooBig = files.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than ${MAX_SIZE_MB} MB. Please choose a smaller file.`);
      return;
    }

    setUploading(true);
    try {
      const uploaded: UploadedFile[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("kind", kind);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.ok) {
          throw new Error(json?.error ?? `Could not upload "${file.name}".`);
        }
        uploaded.push(json.file as UploadedFile);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeFile(url: string) {
    onChange(value.filter((f) => f.url !== url));
  }

  const full = remaining <= 0;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-[15px] font-semibold text-ink">{label}</span>
        <span className="shrink-0 text-[12px] font-medium text-muted">
          {value.length}/{maxFiles} file{maxFiles > 1 ? "s" : ""} · Max {MAX_SIZE_MB} MB each
        </span>
      </div>
      {description && <p className="mb-3 text-[13px] leading-relaxed text-muted">{description}</p>}

      {!full && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!uploading) uploadFiles(e.dataTransfer.files);
          }}
          className={`relative rounded-xl border-2 border-dashed transition-colors duration-200
            ${dragOver ? "border-accent bg-accent-soft/40" : error ? "border-red-300 bg-red-50/30" : "border-line bg-white"}
            ${uploading ? "opacity-70" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={uploading}
            onChange={(e) => uploadFiles(e.target.files)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait"
            aria-label={label}
          />
          <div className="pointer-events-none flex flex-col items-center gap-2 px-4 py-7 text-center sm:py-8">
            {uploading ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin text-accent" aria-hidden="true" />
                <p className="text-[14px] font-semibold text-ink">Uploading…</p>
                <p className="text-[12px] text-muted">Please keep this page open.</p>
              </>
            ) : (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
                  <UploadCloud className="h-5 w-5 text-accent-hover" aria-hidden="true" />
                </span>
                <p className="text-[14px] font-semibold text-ink">
                  Tap to choose file{multiple ? "s" : ""}
                </p>
                <p className="text-[12px] text-muted">
                  {kind === "image" ? "JPG, PNG or WEBP" : "PDF, JPG, PNG or WEBP"} · up to{" "}
                  {MAX_SIZE_MB} MB each
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {full && value.length === 0 && null}

      {error && (
        <p role="alert" className="mt-2 flex animate-fade-in items-start gap-1.5 text-[13px] font-medium text-red-600">
          <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((file) => (
            <li
              key={file.url}
              className="flex animate-fade-in-up items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-soft"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                {file.type === "application/pdf" ? (
                  <FileText className="h-[18px] w-[18px] text-accent-hover" aria-hidden="true" />
                ) : (
                  <ImageIcon className="h-[18px] w-[18px] text-accent-hover" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-ink">{file.name}</span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-medium text-accent-hover underline-offset-2 hover:underline"
                >
                  View file · {formatSize(file.size)}
                </a>
              </span>
              <button
                type="button"
                onClick={() => removeFile(file.url)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {full && (
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-muted">
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Maximum reached — remove a file to upload another.
        </p>
      )}
    </div>
  );
}
