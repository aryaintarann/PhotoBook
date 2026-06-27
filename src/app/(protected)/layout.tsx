import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#e8ddd0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="text-2xl font-bold text-[#3d2b1f] hover:text-[#5c3d2e] transition-colors"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              Kenangan Kita 💕
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/upload"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#3d2b1f] text-white text-sm rounded-full hover:bg-[#5c3d2e] transition-colors"
              >
                <span>+</span>
                <span>Tambah</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
