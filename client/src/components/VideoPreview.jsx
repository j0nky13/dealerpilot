import { motion } from "framer-motion";
import { revealOnScroll } from "../lib/motion.js";
import { copy } from "../lib/copy.js";

export default function VideoTeaser() {
  return (
    <section className="relative py-20" id="demo">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div variants={revealOnScroll} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">{copy.video.title}</h3>
          <div className="relative aspect-video rounded-2xl bg-[#111821] ring-1 ring-white/10 shadow-2xl overflow-hidden">
            <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline src="/video1.mov" poster="/teaser-poster.jpg"></video>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
          <p className="text-sm text-[#9FB0C6] mt-3">{copy.video.kicker}</p>
        </motion.div>
      </div>
    </section>
  );
}
