"use client";

import { useActionState, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { uploadMemory } from "@/app/(protected)/upload/actions";
import SubmitButton from "./SubmitButton";
import { MOOD_OPTIONS } from "@/types/memory";

export default function UploadForm() {
  const [state, formAction] = useActionState(uploadMemory, null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileRef, setFileRef] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileRef(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  });

  return (
    <form action={formAction} className="space-y-5">
      {/* Dropzone */}
      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-2">
          Foto <span className="text-red-500">*</span>
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-[#3d2b1f] bg-[#fdf6ec]"
              : "border-[#e8ddd0] hover:border-[#c4a882]"
          }`}
        >
          <input {...getInputProps({ name: "photo" })} name="photo" />
          {preview && fileRef ? (
            <div className="space-y-3">
              <div className="relative w-full max-w-xs mx-auto aspect-square">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="text-xs text-[#8b6f5e]">
                {fileRef.name} — Klik atau drag untuk ganti
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-4xl">📷</p>
              <p className="text-sm text-[#8b6f5e]">
                {isDragActive
                  ? "Lepaskan foto di sini..."
                  : "Drag foto ke sini, atau klik untuk pilih"}
              </p>
              <p className="text-xs text-[#c4a882]">JPG, PNG, WebP — Max 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <div>
        <label
          htmlFor="caption"
          className="block text-sm font-medium text-[#3d2b1f] mb-1"
        >
          Caption <span className="text-red-500">*</span>
        </label>
        <textarea
          id="caption"
          name="caption"
          required
          rows={3}
          placeholder="Ceritakan momen ini..."
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f] resize-none"
          style={{ fontFamily: "var(--font-caveat)", fontSize: "1.1rem" }}
        />
      </div>

      {/* Tanggal momen */}
      <div>
        <label
          htmlFor="moment_date"
          className="block text-sm font-medium text-[#3d2b1f] mb-1"
        >
          Tanggal momen <span className="text-red-500">*</span>
        </label>
        <input
          id="moment_date"
          name="moment_date"
          type="date"
          required
          max={new Date().toISOString().split("T")[0]}
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f]"
        />
      </div>

      {/* Lokasi */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-[#3d2b1f] mb-1"
        >
          Lokasi <span className="text-[#8b6f5e] font-normal">(opsional)</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="Contoh: Pantai Kuta, Bali"
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f]"
        />
      </div>

      {/* Mood */}
      <div>
        <label
          htmlFor="mood"
          className="block text-sm font-medium text-[#3d2b1f] mb-1"
        >
          Mood <span className="text-[#8b6f5e] font-normal">(opsional)</span>
        </label>
        <select
          id="mood"
          name="mood"
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f]"
        >
          <option value="">Pilih mood...</option>
          {MOOD_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.emoji} {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {state?.error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {state.error}
        </div>
      )}

      <SubmitButton label="Simpan Kenangan 💕" pendingLabel="Menyimpan..." />
    </form>
  );
}
