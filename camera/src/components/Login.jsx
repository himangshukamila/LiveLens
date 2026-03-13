import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (name.trim() === "") {
      alert("Please enter your name");
      return;
    }
    if (email.trim() === "") {
      alert("Please enter your email");
      return;
    }
    if (!email.endsWith("@4brains.in")) {
      alert("Only @4brains.in email allowed");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/camera");
      } else {
        alert("Login failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#080b12] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-120 h-120 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-120 h-120 rounded-full bg-pink-600/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#598fc9] via-[#cf3232] to-[#d91892] flex items-center justify-center shadow-xl shadow-pink-500/25">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-[#598fc9] via-[#cf3232] to-[#d91892] bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-slate-400 mt-2 text-sm tracking-wide">
            Sign in with your 4brains account
          </p>
        </div>

        <div className="bg-white/4 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.12em]">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3
                           text-white placeholder-slate-600 text-sm
                           focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40
                           disabled:opacity-50 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.12em]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@4brains.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3
                           text-white placeholder-slate-600 text-sm
                           focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/40
                           disabled:opacity-50 transition-all duration-200"
              />
              <p className="text-xs text-slate-600 pl-1">
                Only @4brains.in emails are accepted
              </p>
            </div>

            <div className="h-px bg-white/6 -mx-2" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white
                         bg-linear-to-r from-[#598fc9] via-[#cf3232] to-[#d91892]
                         hover:opacity-90 active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-lg shadow-pink-600/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Logging in…
                </span>
              ) : (
                "Login →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
