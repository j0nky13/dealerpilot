import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = 560 }) {
  return createPortal(
    <div className="fixed inset-0 z-[120] pointer-events-none">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/60 pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              key="panel"
              className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="pointer-events-auto w-full rounded-2xl bg-[#0D131B] ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
                style={{ maxWidth }}
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } }}
                exit={{ y: 20, opacity: 1, transition: { duration: 0.18 } }}
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between h-12 px-4 border-b border-white/10">
                  <h3 className="text-sm font-semibold truncate">{title}</h3>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 hover:bg-white/10 transition"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4 text-white/70" />
                  </button>
                </div>
                <div className="p-4">{children}</div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}