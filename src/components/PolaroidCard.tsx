"use client";

import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { MemoryWithUrl } from "@/types/memory";

function getRotation(memoryId: string): number {
  const hash = memoryId
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((hash % 9) - 4) * 0.8;
}

function getMoodEmoji(mood: string | null) {
  const map: Record<string, string> = {
    romantic: "🥰",
    lucu: "😂",
    milestone: "🎉",
    liburan: "✈️",
    makan: "🍽️",
    lainnya: "✨",
  };
  return mood ? map[mood] ?? "✨" : null;
}

type Props = {
  memory: MemoryWithUrl;
  onClick: () => void;
};

export default function PolaroidCard({ memory, onClick }: Props) {
  const rotation = getRotation(memory.id);
  const moodEmoji = getMoodEmoji(memory.mood);
  const dateStr = format(new Date(memory.moment_date + "T00:00:00"), "d MMMM yyyy", {
    locale: id,
  });

  return (
    <div onClick={onClick} className="block group cursor-pointer">
      <div
        className="polaroid-hover"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="bg-white p-3 pb-14 shadow-md border border-gray-100 rounded-sm relative">
          {/* Foto */}
          <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
            <Image
              src={memory.signed_url}
              alt={memory.caption}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 45vw, (max-width: 1280px) 30vw, 22vw"
            />
          </div>

          {/* Caption area */}
          <div className="mt-3 space-y-1">
            <p
              className="text-[#3d2b1f] text-lg leading-tight line-clamp-2"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              {memory.caption}
            </p>
            <p className="text-[#8b6f5e] text-xs">{dateStr}</p>
          </div>

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            {memory.is_favorite && (
              <span className="text-base drop-shadow">❤️</span>
            )}
            {moodEmoji && (
              <span className="text-base drop-shadow">{moodEmoji}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
