"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type State = { error: string } | null;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadMemory(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Kamu harus login dulu" };

  console.log("Logged-in user details:", { id: user.id, email: user.email });

  const file = formData.get("photo") as File | null;
  const caption = (formData.get("caption") as string)?.trim();
  const momentDate = formData.get("moment_date") as string;
  const location = (formData.get("location") as string)?.trim() || null;
  const mood = (formData.get("mood") as string) || null;

  if (!file || file.size === 0) return { error: "Pilih foto dulu ya 📸" };
  if (!ALLOWED_TYPES.includes(file.type))
    return { error: "Format foto harus JPG, PNG, atau WebP" };
  if (file.size > MAX_SIZE) return { error: "Ukuran foto maksimal 10MB" };
  if (!caption) return { error: "Caption tidak boleh kosong 📝" };
  if (!momentDate) return { error: "Tanggal momen harus diisi" };

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("memories-photos")
    .upload(filename, file, { contentType: file.type });

  if (uploadError) {
    console.error("Upload error details:", uploadError);
    return { error: `Gagal upload foto: ${uploadError.message} 🙏` };
  }

  const { error: insertError } = await supabase.from("memories").insert({
    image_path: filename,
    caption,
    moment_date: momentDate,
    location,
    mood,
    created_by: user.id,
  });

  if (insertError) {
    await supabase.storage.from("memories-photos").remove([filename]);
    return { error: "Gagal menyimpan kenangan. Coba lagi ya 🙏" };
  }

  redirect("/?uploaded=true");
}
