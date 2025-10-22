import { motion, AnimatePresence } from "framer-motion";

export default function ContactModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <div className="absolute inset-0 grid place-items-center p-4">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="w-full max-w-lg rounded-2xl bg-[#111821] p-6 ring-1 ring-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Contact</h3>
                <button onClick={onClose} className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15">✕</button>
              </div>
              <form className="grid gap-4">
                <label className="grid gap-1">
                  <span className="text-sm text-[#9FB0C6]">Name</span>
                  <input className="px-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#5BE6CE]" placeholder="Jane Doe" />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm text-[#9FB0C6]">Email or Phone</span>
                  <input className="px-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#5BE6CE]" placeholder="you@example.com" />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm text-[#9FB0C6]">Message</span>
                  <textarea rows={4} className="px-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[#5BE6CE]" placeholder="Tell us what you need" />
                </label>
                <div className="flex items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-[#9FB0C6]">We’ll reply within 1 business day.</p>
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-[#5BE6CE] text-black font-medium hover:brightness-95">Send</button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
