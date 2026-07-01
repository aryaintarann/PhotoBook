"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { id as dateLocale } from "date-fns/locale";
import { MOOD_OPTIONS } from "@/types/memory";
import type { MemoryWithUrl, Memory } from "@/types/memory";
import DeleteButton from "./DeleteButton";
import FavoriteButton from "./FavoriteButton";
import EditMemoryForm from "./EditMemoryForm";

type Props = {
  memory: MemoryWithUrl;
  onClose: () => void;
};

export default function MemoryDetailModal({ memory, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const dateStr = format(
    new Date(memory.moment_date + "T00:00:00"),
    "d MMMM yyyy",
    { locale: dateLocale }
  );

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === memory.mood);

  // Close modal when clicking outside content area
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-[#3d2b1f]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {!isEditing ? (
        <div className="relative flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
          {/* Polaroid besar */}
          <div className="bg-white p-4 pb-16 shadow-2xl w-full relative transform transition-transform duration-300 mx-auto polaroid-swing-hover cursor-pointer">
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100 border border-gray-100">
              <Image
                src={memory.signed_url}
                alt={memory.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 400px"
                priority
              />
            </div>
            <div className="mt-4 space-y-1 text-center flex flex-col items-center">
              <p
                className="text-[#3d2b1f] text-3xl leading-tight"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                {memory.caption}
              </p>
              <p className="text-[#8b6f5e] text-sm">{dateStr}</p>
              {memory.location && (
                <p className="text-[#8b6f5e] text-sm">📍 {memory.location}</p>
              )}
              {moodLabel && (
                <p className="text-sm text-[#8b6f5e] mt-1">
                  {moodLabel.emoji} {moodLabel.label}
                </p>
              )}
            </div>
            {memory.is_favorite && (
              <span className="absolute top-5 right-5 text-2xl drop-shadow-sm">❤️</span>
            )}
          </div>

          {/* Floating Actions Panel */}
          <div className="absolute -right-6 md:-right-20 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4">
            <FavoriteButton memoryId={memory.id} isFavorite={memory.is_favorite} />
            <button
              onClick={() => setIsEditing(true)}
              title="Edit Kenangan"
              className="p-3 rounded-full border border-[#e8ddd0] shadow-sm text-[#3d2b1f] hover:bg-gray-50 hover:scale-105 transition-all text-xl flex items-center justify-center bg-white"
            >
              ✏️
            </button>
            <DeleteButton memoryId={memory.id} imagePath={memory.image_path} />
          </div>
          
          {/* Mobile Actions Panel (bottom) */}
          <div className="md:hidden mt-8 flex items-center gap-4">
            <FavoriteButton memoryId={memory.id} isFavorite={memory.is_favorite} />
            <button
              onClick={() => setIsEditing(true)}
              title="Edit Kenangan"
              className="p-3 rounded-full border border-[#e8ddd0] shadow-sm text-[#3d2b1f] hover:bg-gray-50 hover:scale-105 transition-all text-xl flex items-center justify-center bg-white"
            >
              ✏️
            </button>
            <DeleteButton memoryId={memory.id} imagePath={memory.image_path} />
          </div>

          {/* Close Button Floating */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 md:-right-12 md:-top-12 text-3xl text-white/80 hover:text-white transition-all z-10 cursor-pointer w-10 h-10 flex items-center justify-center drop-shadow-md"
            aria-label="Tutup"
          >
            &times;
          </button>
        </div>
      ) : (
        <div 
          className="bg-[#fdf9f5] border border-[#e8ddd0] rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsEditing(false)}
            className="absolute top-3 right-3 text-2xl text-[#8b6f5e] hover:text-[#3d2b1f] hover:scale-105 transition-all z-10 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-[#e8ddd0]"
            aria-label="Batal"
          >
            &times;
          </button>
          <EditMemoryForm
            memory={memory as unknown as Memory}
            alwaysShowForm={true}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
