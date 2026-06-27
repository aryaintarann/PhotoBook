import { createClient } from "@/lib/supabase/server";

const BUCKET = "memories-photos";
const EXPIRY = 3600;

export async function getSignedUrl(imagePath: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(imagePath, EXPIRY);

  if (error || !data) throw new Error("Could not generate signed URL");
  return data.signedUrl;
}

export async function getSignedUrlsMap(
  imagePaths: string[]
): Promise<Map<string, string>> {
  if (imagePaths.length === 0) return new Map();

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(imagePaths, EXPIRY);

  if (error || !data) throw new Error("Could not generate signed URLs");

  const map = new Map<string, string>();
  data.forEach(({ path, signedUrl }) => {
    if (path && signedUrl) map.set(path, signedUrl);
  });
  return map;
}
