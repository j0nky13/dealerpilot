import { motion } from "framer-motion";
import { revealOnScroll } from "../lib/motion.js";
import { copy } from "../lib/copy.js";

export default function CTA() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div variants={revealOnScroll} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-2xl bg-[#111821] ring-1 ring-white/10 p-10 text-center shadow-2xl">
          <h3 className="text-3xl font-semibold mb-2">{copy.cta.title}</h3>
          <p className="text-[#9FB0C6] mb-6">{copy.cta.sub}</p>
          <a href="#" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#5BE6CE] text-black font-medium hover:brightness-95">Sign up for early access</a>
        </motion.div>
      </div>
    </section>
  );
}