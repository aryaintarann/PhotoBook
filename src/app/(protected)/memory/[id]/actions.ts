"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type UpdateState = { error: string } | { error: null } | null;

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function toggleFavorite(id: string, currentValue: boolean) {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect("/login");

  await supabase
    .from("memories")
    .update({ is_favorite: !currentValue, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath(`/memory/${id}`);
  revalidatePath("/");
}

export async function updateMemory(
  id: string,
  _prevState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect("/login");

  const caption = (formData.get("caption") as string)?.trim();
  const momentDate = formData.get("moment_date") as string;
  const location = (formData.get("location") as string)?.trim() || null;
  const mood = (formData.get("mood") as string) || null;

  if (!caption || !momentDate) return { error: "Caption dan tanggal wajib diisi" };

  const { error } = await supabase
    .from("memories")
    .update({
      caption,
      moment_date: momentDate,
      location,
      mood,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "Gagal menyimpan perubahan" };

  revalidatePath(`/memory/${id}`);
  revalidatePath("/");
  return { error: null };
}

export async function deleteMemory(id: string, imagePath: string) {
  const { supabase, user } = await getAuthUser();
  if (!user) redirect("/login");

  const { error: dbError } = await supabase
    .from("memories")
    .delete()
    .eq("id", id);

  if (dbError) return;

  await supabase.storage.from("memories-photos").remove([imagePath]);

  redirect("/");
}
