import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrl } from "@/lib/utils/signedUrl";
import { MOOD_OPTIONS } from "@/types/memory";
import type { Memory } from "@/types/memory";
import DeleteButton from "@/components/DeleteButton";
import FavoriteButton from "@/components/FavoriteButton";
import EditMemoryForm from "@/components/EditMemoryForm";

type Params = Promise<{ id: string }>;

export default async function MemoryDetailPage({ params }: { params: Params }) {
  const { id: memoryId } = await params;
  const supabase = await createClient();

  const { data: memory, error } = await supabase
    .from("memories")
    .select("*")
    .eq("id", memoryId)
    .single();

  if (error || !memory) notFound();

  const signedUrl = await getSignedUrl((memory as Memory).image_path);
  const dateStr = format(
    new Date((memory as Memory).moment_date + "T00:00:00"),
    "d MMMM yyyy",
    { locale: id }
  );

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === memory.mood);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#8b6f5e] hover:text-[#3d2b1f] mb-6 transition-colors"
      >
        ← Kembali ke galeri
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Polaroid besar */}
        <div className="flex justify-center">
          <div className="bg-white p-4 pb-20 shadow-xl w-full max-w-sm relative">
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
              <Image
                src={signedUrl}
                alt={memory.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 400px"
                priority
              />
            </div>
            <div className="mt-4 space-y-1">
              <p
                className="text-[#3d2b1f] text-2xl leading-tight"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                {memory.caption}
              </p>
              <p className="text-[#8b6f5e] text-sm">{dateStr}</p>
              {memory.location && (
                <p className="text-[#8b6f5e] text-sm">📍 {memory.location}</p>
              )}
              {moodLabel && (
                <p className="text-sm">
                  {moodLabel.emoji} {moodLabel.label}
                </p>
              )}
            </div>
            {memory.is_favorite && (
              <span className="absolute top-5 right-5 text-xl">❤️</span>
            )}
          </div>
        </div>

        {/* Actions panel */}
        <div className="space-y-6">
          <div className="flex gap-3">
            <FavoriteButton memoryId={memory.id} isFavorite={memory.is_favorite} />
            <DeleteButton memoryId={memory.id} imagePath={memory.image_path} />
          </div>

          <EditMemoryForm memory={memory as Memory} />
        </div>
      </div>
    </div>
  );
}
