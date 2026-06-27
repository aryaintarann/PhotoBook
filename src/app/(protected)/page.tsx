import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrlsMap } from "@/lib/utils/signedUrl";
import ScrapbookGrid from "@/components/ScrapbookGrid";
import FilterBar from "@/components/FilterBar";
import Toast from "@/components/Toast";
import type { Memory, MemoryWithUrl } from "@/types/memory";

type SearchParams = Promise<{
  mood?: string;
  search?: string;
  favorites?: string;
  uploaded?: string;
  from?: string;
  to?: string;
}>;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("memories")
    .select("*")
    .order("moment_date", { ascending: false });

  if (params.mood) query = query.eq("mood", params.mood);
  if (params.search) query = query.ilike("caption", `%${params.search}%`);
  if (params.favorites === "true") query = query.eq("is_favorite", true);
  if (params.from) query = query.gte("moment_date", params.from);
  if (params.to) query = query.lte("moment_date", params.to);

  const { data: memories, error } = await query;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-red-500">
        Gagal memuat kenangan. Coba refresh ya 🙏
      </div>
    );
  }

  const imagePaths = (memories as Memory[]).map((m) => m.image_path);
  const signedUrls = await getSignedUrlsMap(imagePaths);

  const memoriesWithUrls: MemoryWithUrl[] = (memories as Memory[]).map((m) => ({
    ...m,
    signed_url: signedUrls.get(m.image_path) ?? "",
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {params.uploaded === "true" && (
        <Toast message="Kenangan berhasil disimpan! 💕" />
      )}

      <Suspense>
        <FilterBar />
      </Suspense>

      <ScrapbookGrid memories={memoriesWithUrls} />
    </div>
  );
}
