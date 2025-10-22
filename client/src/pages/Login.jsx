import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ShieldCheck, Building2, Link2, RefreshCcw } from "lucide-react";
import AnimatedGrid from "../components/AnimatedGrid.jsx";
import Viewport from "../components/Viewport.jsx";

/**
 * Login (Email Link mode)
 * - Default flow: collect email (+ optional tenant code) → send magic link → "check your email" screen
 * - 6-digit OTP scaffolding is preserved in comments for later switch-over
 * - No Firebase wiring yet; handlers are stubbed with TODOs
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [tenant, setTenant] = useState(""); // optional dealership code/domain
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  // TODO: when wiring Firebase:
  // import { sendSignInLinkToEmail } from "firebase/auth";
  // const actionCodeSettings = {
  //   url: `${window.location.origin}/app`, // or include tenant as a query param
  //   handleCodeInApp: true,
  //   dynamicLinkDomain: "your-dynamic-link.page.link", // optional
  // };

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setStatus("sending");
      setError("");

      // TODO (Firebase): await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // localStorage.setItem("dealerpilot_login_email", email);
      // if (tenant) localStorage.setItem("dealerpilot_tenant_hint", tenant);

      // Simulate success for now:
      await new Promise((r) => setTimeout(r, 500));
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError("Could not send link. Please try again.");
    }
  };

  const handleResend = async () => {
    if (status !== "sent") return;
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 400));
    setStatus("sent");
  };

  const openWebmail = (provider) => {
    const map = {
      gmail: "https://mail.google.com/",
      outlook: "https://outlook.office.com/mail/",
      yahoo: "https://mail.yahoo.com/",
    };
    window.open(map[provider], "_blank", "noopener,noreferrer");
  };

  return (
    <Viewport>
      <section className="relative min-h-screen">
        <AnimatedGrid />

        {/* Top utility bar */}
        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
              title="Back to landing"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="text-xs text-[#9FB0C6]">Secure Portal</div>
          </div>
        </div>

        {/* Centered card */}
        <div className="relative z-10 grid place-items-center px-4 pb-20">
          <div className="w-full max-w-md mt-10 rounded-2xl bg-[#0D131B]/90 ring-1 ring-white/10 backdrop-blur shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
            {/* Card header */}
            <div className="px-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 grid place-items-center rounded-xl bg-[#5BE6CE]/10 ring-1 ring-[#5BE6CE]/25">
                  <ShieldCheck className="h-4 w-4 text-[#5BE6CE]" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold leading-tight">DealerPilot Portal</h1>
                  <p className="text-xs text-[#9FB0C6]">Sign in with a secure email link</p>
                </div>
              </div>
            </div>

            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Body */}
            <div className="px-6 py-6">
              {status === "sent" ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="h-4 w-4 text-[#5BE6CE]" />
                    <div>
                      We sent a sign-in link to <span className="font-medium">{email}</span>.
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/[0.06] ring-1 ring-white/10 p-4 text-sm text-[#C7D6EA]">
                    Open the email on this device and click the link to continue. If you don’t see it, check Spam/Promotions.
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openWebmail("gmail")}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                    >
                      Open Gmail
                    </button>
                    <button
                      onClick={() => openWebmail("outlook")}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                    >
                      Open Outlook
                    </button>
                    <button
                      onClick={() => openWebmail("yahoo")}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                    >
                      Open Yahoo
                    </button>

                    <div className="ml-auto" />

                    <button
                      onClick={handleResend}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
                      title="Resend link"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Resend
                    </button>
                  </div>

                  <div className="text-xs text-[#9FB0C6]">
                    Wrong email?{" "}
                    <button
                      className="underline hover:no-underline"
                      onClick={() => {
                        setStatus("idle");
                        setError("");
                      }}
                    >
                      Use a different email
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendLink} className="space-y-4">
                  {/* Optional tenant code */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-[#9FB0C6]">Dealership code (optional)</span>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Building2 className="h-4 w-4 opacity-70" />
                      <input
                        value={tenant}
                        onChange={(e) => setTenant(e.target.value)}
                        placeholder="e.g. marsh-monster-west"
                        className="bg-transparent outline-none text-sm w-full"
                        autoComplete="organization"
                      />
                    </div>
                  </label>

                  {/* Email input */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs text-[#9FB0C6]">Email</span>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                      <Mail className="h-4 w-4 opacity-70" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@dealership.com"
                        className="bg-transparent outline-none text-sm w-full"
                        type="email"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </label>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full h-10 rounded-lg bg-[#5BE6CE] text-black font-medium hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Sending…" : "Send sign-in link"}
                  </button>

                  {status === "error" && (
                    <div className="text-xs text-rose-300">{error}</div>
                  )}

                  <div className="text-xs text-[#9FB0C6]">
                    We’ll email you a secure sign-in link. By continuing you agree to our{" "}
                    <a className="underline hover:no-underline" href="#" onClick={(e) => e.preventDefault()}>Terms</a>.
                  </div>
                </form>
              )}
            </div>

            {/* Card footer */}
            <div className="px-6 pb-6">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#9FB0C6]">
                  Need access?{" "}
                  <Link to="/" className="underline hover:no-underline">Request a demo</Link>
                </div>
                <Link to="/" className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15">
                  Back to site
                </Link>
              </div>
            </div>
          </div>

          {/* Helper text */}
          <div className="mt-6 text-center text-xs text-[#9FB0C6]">
            If the link doesn’t arrive, check spam or ask your manager to verify your email.
          </div>

          {/* ---------- OPTIONAL: keep 6-digit OTP UI scaffold for later ----------
          <div className="mt-8 text-center text-xs text-[#9FB0C6]">
            Prefer a code instead? We can enable 6-digit email OTP later without changing this page.
          </div>
          --------------------------------------------------------------------- */}
        </div>
      </section>
    </Viewport>
  );
}