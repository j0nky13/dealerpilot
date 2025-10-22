import { motion } from "framer-motion";
import { revealOnScroll } from "../lib/motion.js";

const items = [
  {
    title: "Instant manager visibility",
    body: "See every lead and follow-up in real time—no refreshing, no digging.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
  },
  {
    title: "Zero learning curve",
    body: "Built around the next action: add lead, follow up, log the outcome.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 7h16M4 12h10M4 17h7" />
      </svg>
    ),
  },
  {
    title: "Blazing fast",
    body: "Minimal UI, fewer clicks, instant filtering—stay in the flow.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h7l-2 8L21 4l-7 0 2-8-13 16Z" />
      </svg>
    ),
  },
  {
    title: "Secure & cloud-native",
    body: "Modern auth and role-based access. Your data, scoped to your store.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3a6 6 0 0 0-6 6v2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V9a6 6 0 0 0-6-6Z" />
      </svg>
    ),
  },
];

export default function DifferentStrip() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          variants={revealOnScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-4"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.06 * i, ease: "easeOut" }}
              className="rounded-2xl bg-[#111821]/70 ring-1 ring-white/10 p-5 shadow-xl backdrop-blur-sm hover:ring-white/20 transition"
            >
              <div className="flex items-center gap-2 text-[#5BE6CE]">
                <div className="grid place-items-center h-8 w-8 rounded-lg bg-[#5BE6CE]/10">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold tracking-wide">{item.title}</h3>
              </div>
              <p className="mt-2 text-sm text-[#9FB0C6]">{item.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}