import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen paper-texture flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold mb-2"
            style={{ fontFamily: "var(--font-caveat)", color: "#3d2b1f" }}
          >
            Kenangan Kita
          </h1>
          <p className="text-sm text-[#8b6f5e]">
            Tempat menyimpan momen berdua ✨
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg p-8 border border-[#e8ddd0]"
          style={{ boxShadow: "0 4px 24px rgba(61,43,31,0.12)" }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
