"use client";

import { useEffect, useState } from "react";

type Props = {
  message: string;
  duration?: number;
};

export default function Toast({ message, duration = 3000 }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-once">
      <div className="bg-[#3d2b1f] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm">
        <span>✨</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
