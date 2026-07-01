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
      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg p-1.5 px-2.5">
        <span className="text-xs text-[#3d2b1f] font-medium">Hapus?</span>
        <button
          onClick={() =>
            startTransition(async () => {
              await deleteMemory(memoryId, imagePath);
            })
          }
          disabled={isPending}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
        >
          {isPending ? "..." : "Ya"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-2 py-1 text-xs border border-[#e8ddd0] rounded text-[#3d2b1f] bg-white hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      title="Hapus Kenangan"
      className="p-3 border shadow-sm border-red-200 text-red-600 rounded-full hover:bg-red-50 hover:scale-105 transition-all text-xl flex items-center justify-center bg-white"
    >
      🗑️
    </button>
  );
}
