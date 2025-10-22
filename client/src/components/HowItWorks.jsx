import { motion } from "framer-motion";
import { revealOnScroll } from "../lib/motion.js";


const steps = [
  {
    title: "Capture",
    body: "Add a lead in seconds or import a list. Only the fields you need.",
  },
  {
    title: "Assign",
    body: "Give it to a rep (manager-visible). Round-robin can come later.",
  },
  {
    title: "Follow up",
    body: "Timed reminders keep reps on track. Log calls, texts, emails.",
  },
  {
    title: "Track",
    body: "Managers watch status and activity in real time—no refresh.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          variants={revealOnScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold">How it works</h2>
          <p className="mt-3 text-sm text-[#9FB0C6]">
            A simple flow your team can actually follow.
          </p>
        </motion.div>

        {/* Stepper container */}
        <div className="relative rounded-3xl bg-[#0D131B] ring-1 ring-white/10 p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Gradient glow backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[120%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(91,230,206,0.18), rgba(17,24,33,0))",
            }}
          />

          {/* Curved line connector (desktop) */}
          <svg
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-[112px] mx-auto w-[92%] h-[90px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="hw-line" x1="0" x2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="50%" stopColor="rgba(91,230,206,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
              </linearGradient>
            </defs>
            <path
              d="M 48 60 C 200 0, 420 0, 640 60"
              fill="none"
              stroke="url(#hw-line)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>

          {/* Steps */}
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.09 * i, ease: "easeOut" }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative rounded-2xl bg-[#111821]/70 ring-1 ring-white/10 p-5 md:p-6 backdrop-blur-sm shadow-xl transition
                                hover:ring-white/20 hover:-translate-y-1">
                  {/* Ghost step number */}
                  <div className="pointer-events-none absolute -top-6 -right-2 text-6xl md:text-7xl font-black tracking-tighter text-white/5">
                    {i + 1}
                  </div>

                  {/* Pill label */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#5BE6CE]/10 text-[#5BE6CE] px-3 py-1 text-xs font-semibold ring-1 ring-[#5BE6CE]/20">
                    Step {i + 1}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-[#9FB0C6] leading-relaxed">{s.body}</p>

                  {/* Bottom accent line */}
                  <span className="mt-4 block h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* Desktop connector dots */}
                <div className="hidden md:block">
                  {/* Left dot (except first) */}
                  {i !== 0 && (
                    <div className="absolute left-[-10px] top-[98px] h-2 w-2 rounded-full bg-white/40 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]" />
                  )}
                  {/* Right dot (except last) */}
                  {i !== steps.length - 1 && (
                    <div className="absolute right-[-10px] top-[98px] h-2 w-2 rounded-full bg-white/40 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile vertical rail */}
          <div className="md:hidden mt-6 h-px w-full bg-gradient-to-r from-white/10 via-white/15 to-white/10" />
        </div>
      </div>
    </section>
  );
}