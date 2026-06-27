"use client";

import PolaroidCard from "./PolaroidCard";
import type { MemoryWithUrl } from "@/types/memory";

type Props = {
  memories: MemoryWithUrl[];
};

export default function ScrapbookGrid({ memories }: Props) {
  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p
          className="text-5xl mb-4"
          style={{ fontFamily: "var(--font-caveat)", color: "#8b6f5e" }}
        >
          Belum ada kenangan nih...
        </p>
        <p className="text-[#8b6f5e] text-sm">
          Yuk tambahkan foto pertama kalian! 📸
        </p>
      </div>
    );
  }

  return (
    <div className="masonry">
      {memories.map((memory) => (
        <PolaroidCard key={memory.id} memory={memory} />
      ))}
    </div>
  );
}
