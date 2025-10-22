import { motion } from "framer-motion";
import { revealOnScroll } from "../lib/motion.js";

const modes = [
  {
    title: "Web Dashboard",
    body: "Access DealerPilot from any browser — real-time updates, team oversight, and no installs required.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
        <path d="M8 20h8" />
      </svg>
    ),
  },
  {
    title: "Local App",
    body: "Offline-first tool for reps who need to log leads and follow-ups anywhere — syncs when online again.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18M3 12h18" />
      </svg>
    ),
  },
  {
    title: "Manager Console",
    body: "Bird’s-eye view of every lead, rep, and follow-up across your dealership network.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
      </svg>
    ),
  },
];

export default function UsageModes() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          variants={revealOnScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center mb-12"
        >
          Choose Your Flow
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {modes.map((mode, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i, ease: "easeOut" }}
              className="rounded-2xl bg-[#111821]/70 ring-1 ring-white/10 p-6 shadow-xl backdrop-blur-sm hover:ring-white/20 hover:-translate-y-1 transition"
            >
              <div className="flex items-center gap-2 text-[#5BE6CE] mb-3">
                <div className="grid place-items-center h-8 w-8 rounded-lg bg-[#5BE6CE]/10">
                  {mode.icon}
                </div>
                <h3 className="text-lg font-semibold">{mode.title}</h3>
              </div>
              <p className="text-sm text-[#9FB0C6] leading-relaxed">{mode.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}