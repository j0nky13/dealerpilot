import { motion } from "framer-motion";
import { revealOnScroll, floatGlow } from "../lib/motion.js";
import { copy } from "../lib/copy.js";

export default function ProductVision() {
  return (
    <section className="relative py-24" id="vision">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={revealOnScroll} initial="hidden" whileInView="show" viewport={{ once: true }} className="order-2 md:order-1">
          <p className="text-sm uppercase tracking-wider text-[#5BE6CE]/80">{copy.vision.eyebrow}</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">{copy.vision.title}</h2>
          <p className="mt-4 text-[#9FB0C6] leading-relaxed">{copy.vision.body}</p>
        </motion.div>
        <motion.div variants={floatGlow} initial="hidden" whileInView="show" viewport={{ once: true }} className="order-1 md:order-2">
          <div className="relative aspect-video rounded-2xl bg-[#111821] ring-1 ring-white/10 shadow-2xl overflow-hidden">
            <img src="/preview1.png" alt="DealerPilot preview" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5BE6CE]/10 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}