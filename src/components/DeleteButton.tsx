"use client";

import { useState, useTransition } from "react";
import { deleteMemory } from "@/app/(protected)/memory/[id]/actions";

type Props = {
  memoryId: string;
  imagePath: string;
};

export default function DeleteButton({ memoryId, imagePath }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#3d2b1f]">Yakin hapus?</span>
        <button
          onClick={() =>
            startTransition(async () => {
              await deleteMemory(memoryId, imagePath);
            })
          }
          disabled={isPending}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isPending ? "Menghapus..." : "Ya, hapus"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-3 py-1.5 text-sm border border-[#e8ddd0] rounded-md text-[#3d2b1f] hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
    >
      🗑️ Hapus
    </button>
  );
}
