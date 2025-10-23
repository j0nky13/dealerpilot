// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeMagicLinkSignIn, sendMagicLink, logout } from "../lib/firebase";
import { useAuth } from "../lib/authProvider.jsx";
import AnimatedGrid from "../components/AnimatedGrid.jsx";
import FancyLoader from "../components/FancyLoader.jsx";

export default function Login() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [storeCode, setStoreCode] = useState(() => localStorage.getItem("storeCode") || "");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  // Complete magic link if present (runs once)
  useEffect(() => {
    completeMagicLinkSignIn().catch((e) => setErr(e.message || "Sign-in failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefill store code from ?store= param if present
  useEffect(() => {
    const u = new URL(window.location.href);
    const q = u.searchParams.get("store");
    if (q) {
      setStoreCode(q);
      localStorage.setItem("storeCode", q);
    }
  }, []);

  // Loading state from auth provider — avoid rendering UI until we know auth status
  if (loading) {
    return <FancyLoader title="Checking authentication…" subtitle="Preparing your workspace" />;
  }

  // If already signed in, show a gentle gate instead of auto-redirecting
  if (user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-white">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <AnimatedGrid />
        </div>

        <button
          onClick={() => nav(-1)}
          className="absolute left-5 top-5 z-20 rounded-md px-3 py-1.5 text-sm text-[#9FB0C6] hover:text-white hover:bg-white/5"
        >
          ← Back
        </button>
        <div className="absolute right-5 top-5 z-20 text-xs text-[#9FB0C6]">Secure Portal</div>

        <main className="relative z-10 grid min-h-screen place-items-center px-6 py-16">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F161F]/80 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
            <h1 className="text-xl font-semibold">You’re already signed in</h1>
            <p className="mt-1 text-sm text-[#9FB0C6]">{user.email}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => nav("/app/today", { replace: true })}
                className="rounded-lg bg-[#5BE6CE] px-4 py-2 font-medium text-black hover:brightness-95"
              >
                Continue to app
              </button>
              <button
                onClick={async () => {
                  await logout();
                  nav("/login", { replace: true });
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
              >
                Sign out
              </button>
            </div>

            <p className="mt-5 text-center text-[11px] text-[#748AA5]">
              If this isn’t you, sign out and sign back in with the correct email.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Not signed in: render the email-link flow
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <AnimatedGrid />
      </div>

      {/* Back link */}
      <button
        onClick={() => nav(-1)}
        className="absolute left-5 top-5 z-20 rounded-md px-3 py-1.5 text-sm text-[#9FB0C6] hover:text-white hover:bg-white/5"
      >
        ← Back
      </button>

      {/* Secure tag top-right */}
      <div className="absolute right-5 top-5 z-20 text-xs text-[#9FB0C6]">Secure Portal</div>

      {/* ---- Center card ---- */}
      <main className="relative z-10 grid min-h-screen place-items-center px-6 py-16">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F161F]/80 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
          {/* header */}
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l7 3v6c0 4.97-3.05 8.91-7 10-3.95-1.09-7-5.03-7-10V6l7-3z" stroke="#5BE6CE" strokeWidth="1.5" />
                <path d="M9.5 12.5l2 2 3.5-4" stroke="#5BE6CE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <h1 className="text-xl font-semibold">DealerPilot Portal</h1>
              <p className="text-xs text-[#9FB0C6]">Sign in with a secure email link</p>
            </div>
          </div>

          <form
            className="mt-4 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr("");
              setSent(false);
              setSending(true);
              try {
                if (storeCode) localStorage.setItem("storeCode", storeCode.trim());
                await sendMagicLink(email.trim());
                setSent(true);
              } catch (ex) {
                setErr(ex.message || "Failed to send link");
              } finally {
                setSending(false);
              }
            }}
          >
            {/* store code (optional) */}
            <div>
              <label htmlFor="store" className="mb-1 block text-sm text-[#9FB0C6]">
                Dealership code (optional)
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#5BE6CE]/40">
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <input
                  id="store"
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value)}
                  placeholder="e.g. marsh-monster-west"
                  className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[#8AA0B8]"
                />
              </div>
            </div>

            {/* email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-[#9FB0C6]">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-[#5BE6CE]/40">
                <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
                  <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  placeholder="you@dealership.com"
                  className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-[#8AA0B8]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* primary action */}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-[#5BE6CE] px-4 py-2.5 font-medium text-black transition hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? "Sending…" : "Send sign-in link"}
            </button>
          </form>

          {/* helper text */}
          <p className="mt-3 text-xs text-[#9FB0C6]">
            We’ll email you a secure sign-in link. By continuing you agree to our{" "}
            <a href="/terms" className="text-white hover:underline">Terms</a>.
          </p>

          {/* status + errors */}
          {sent && (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-[#9FB0C6]">
              Link sent to <span className="text-white">{email}</span>. Open it on this device to finish signing in.
            </div>
          )}
          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

          {/* footer actions */}
          <div className="mt-5 flex items-center justify-between text-xs text-[#9FB0C6]">
            <a href="/contact" className="hover:text-white">Need access? Request a demo</a>
            <a href="/" className="rounded-md bg-white/5 px-3 py-1.5 hover:bg-white/10">Back to site</a>
          </div>

          <p className="mt-5 text-center text-[11px] text-[#748AA5]">
            If the link doesn’t arrive, check spam or ask your manager to verify your email.
          </p>
        </div>
      </main>
    </div>
  );
}