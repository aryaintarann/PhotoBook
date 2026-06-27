"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { MOOD_OPTIONS } from "@/types/memory";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentMood = searchParams.get("mood") ?? "";
  const currentSearch = searchParams.get("search") ?? "";
  const currentFavorites = searchParams.get("favorites") === "true";

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.push("/");

  const hasFilters = currentMood || currentSearch || currentFavorites;

  return (
    <div className="mb-6">
      {/* Mobile toggle */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm text-[#3d2b1f] font-medium"
        >
          <span>🔍</span>
          <span>Filter & Cari</span>
          {hasFilters && (
            <span className="bg-[#3d2b1f] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          )}
        </button>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#8b6f5e] underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Filter bar — always visible on desktop, toggle on mobile */}
      <div className={`${open ? "block" : "hidden"} md:block`}>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Cari caption..."
            defaultValue={currentSearch}
            onChange={(e) => {
              const v = e.target.value;
              clearTimeout((window as Window & { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout);
              (window as Window & { _searchTimeout?: ReturnType<typeof setTimeout> })._searchTimeout = setTimeout(
                () => update("search", v || null),
                400
              );
            }}
            className="px-3 py-1.5 text-sm border border-[#e8ddd0] rounded-full bg-white text-[#3d2b1f] placeholder-[#c4a882] focus:outline-none focus:ring-2 focus:ring-[#c4a882]"
          />

          {/* Mood filter */}
          <select
            value={currentMood}
            onChange={(e) => update("mood", e.target.value || null)}
            className="px-3 py-1.5 text-sm border border-[#e8ddd0] rounded-full bg-white text-[#3d2b1f] focus:outline-none focus:ring-2 focus:ring-[#c4a882]"
          >
            <option value="">Semua mood</option>
            {MOOD_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.emoji} {m.label}
              </option>
            ))}
          </select>

          {/* Favorites toggle */}
          <button
            onClick={() =>
              update("favorites", currentFavorites ? null : "true")
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-colors ${
              currentFavorites
                ? "bg-[#3d2b1f] text-white border-[#3d2b1f]"
                : "bg-white text-[#3d2b1f] border-[#e8ddd0] hover:border-[#c4a882]"
            }`}
          >
            <span>❤️</span>
            <span>Favorit</span>
          </button>

          {/* Clear — desktop */}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="hidden md:block text-xs text-[#8b6f5e] underline"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
