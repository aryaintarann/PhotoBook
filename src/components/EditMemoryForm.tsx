"use client";

import { useActionState, useState, useEffect } from "react";
import { updateMemory } from "@/app/(protected)/memory/[id]/actions";
import SubmitButton from "./SubmitButton";
import { MOOD_OPTIONS } from "@/types/memory";
import type { Memory } from "@/types/memory";

type Props = {
  memory: Memory;
  alwaysShowForm?: boolean;
  onCancel?: () => void;
};

export default function EditMemoryForm({ memory, alwaysShowForm = false, onCancel }: Props) {
  const [isEditing, setIsEditing] = useState(alwaysShowForm);

  // bind id as the first extra arg; useActionState handles prevState + formData
  const updateWithId = updateMemory.bind(null, memory.id);
  const [state, formAction] = useActionState(updateWithId, null);

  useEffect(() => {
    if (state && !state.error) {
      if (onCancel) {
        onCancel();
      } else {
        setIsEditing(false);
      }
    }
  }, [state, onCancel]);

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        title="Edit Kenangan"
        className="p-2.5 border border-[#e8ddd0] text-[#3d2b1f] rounded-lg hover:bg-gray-50 transition-colors text-xl flex items-center justify-center bg-white"
      >
        ✏️
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <h3
        className="text-xl font-semibold text-[#3d2b1f]"
        style={{ fontFamily: "var(--font-caveat)" }}
      >
        Edit Kenangan
      </h3>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
          Caption
        </label>
        <textarea
          name="caption"
          required
          defaultValue={memory.caption}
          rows={3}
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f] resize-none"
          style={{ fontFamily: "var(--font-caveat)", fontSize: "1.1rem" }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
          Tanggal momen
        </label>
        <input
          name="moment_date"
          type="date"
          required
          defaultValue={memory.moment_date}
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
          Lokasi
        </label>
        <input
          name="location"
          type="text"
          defaultValue={memory.location ?? ""}
          className="w-full px-3 py-2 border border-[#e8ddd0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c4a882] bg-[#fdf9f5] text-[#3d2b1f]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#3d2b1f] mb-1">
          Mood
        </label>
        <select
          name="mood"
          defaultValue={memory.mood ?? ""}
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

      {state?.error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {state.error}
        </div>
      )}

      <div className="flex gap-3">
        <SubmitButton label="Simpan" pendingLabel="Menyimpan..." />
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              setIsEditing(false);
            }
          }}
          className="flex-1 py-3 px-4 border border-[#e8ddd0] rounded-lg text-[#3d2b1f] hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
