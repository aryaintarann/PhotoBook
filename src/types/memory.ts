export type Memory = {
  id: string;
  image_path: string;
  caption: string;
  moment_date: string;
  location: string | null;
  mood: string | null;
  is_favorite: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type MemoryWithUrl = Memory & { signed_url: string };

export const MOOD_OPTIONS = [
  { value: "romantic", label: "Romantic", emoji: "🥰" },
  { value: "lucu", label: "Lucu", emoji: "😂" },
  { value: "milestone", label: "Milestone", emoji: "🎉" },
  { value: "liburan", label: "Liburan", emoji: "✈️" },
  { value: "makan", label: "Makan", emoji: "🍽️" },
  { value: "lainnya", label: "Lainnya", emoji: "✨" },
] as const;

export type MoodValue = (typeof MOOD_OPTIONS)[number]["value"];
