"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/app/(protected)/memory/[id]/actions";

type Props = {
  memoryId: string;
  isFavorite: boolean;
};

export default function FavoriteButton({ memoryId, isFavorite }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() => toggleFavorite(memoryId, isFavorite))
      }
      disabled={isPending}
      title={isFavorite ? "Hapus dari Favorit" : "Jadikan Favorit"}
      className={`p-3 rounded-full border shadow-sm transition-all disabled:opacity-50 text-xl flex items-center justify-center bg-white hover:scale-105 ${
        isFavorite
          ? "bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100"
          : "border-[#e8ddd0] text-[#3d2b1f] hover:bg-gray-50"
      }`}
    >
      {isFavorite ? "❤️" : "🤍"}
    </button>
  );
}
