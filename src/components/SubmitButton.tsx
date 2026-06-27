"use client";

import { useFormStatus } from "react-dom";

type Props = {
  label?: string;
  pendingLabel?: string;
};

export default function SubmitButton({
  label = "Simpan",
  pendingLabel = "Menyimpan...",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-6 bg-[#3d2b1f] text-white rounded-lg hover:bg-[#5c3d2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
