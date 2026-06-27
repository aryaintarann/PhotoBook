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
      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border transition-colors disabled:opacity-50 ${
        isFavorite
          ? "bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100"
          : "border-[#e8ddd0] text-[#3d2b1f] hover:bg-gray-50"
      }`}
    >
      <span>{isFavorite ? "❤️" : "🤍"}</span>
      <span>{isFavorite ? "Favorit" : "Jadikan favorit"}</span>
    </button>
  );
}
