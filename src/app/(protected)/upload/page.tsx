import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1
        className="text-4xl font-bold text-[#3d2b1f] mb-8"
        style={{ fontFamily: "var(--font-caveat)" }}
      >
        Tambah Kenangan Baru 📸
      </h1>
      <div className="bg-white rounded-lg shadow-md border border-[#e8ddd0] p-6">
        <UploadForm />
      </div>
    </div>
  );
}
