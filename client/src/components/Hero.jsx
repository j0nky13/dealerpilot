import { motion } from "framer-motion";
import AnimatedGrid from "./AnimatedGrid.jsx";
import { copy } from "../lib/copy.js";
import { fadeInUp, staggerChildren } from "../lib/motion.js";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[88vh]">
      {/* Background grid */}
      <AnimatedGrid />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-28">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-semibold tracking-tight"
          >
            {copy.hero.title}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-lg text-[#9FB0C6] max-w-2xl"
          >
            {copy.hero.sub}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#demo"
              className="px-5 py-3 rounded-xl bg-[#5BE6CE] text-black font-medium hover:brightness-95 transition"
            >
              {copy.hero.primaryCTA}
            </a>
            <Link
              to="/login"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition"
            >
              {copy.hero.secondaryCTA}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Soft fade into next section (no hard divider) */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-28 bg-gradient-to-b from-transparent to-[#0B0F14]" />
    </section>
  );
}