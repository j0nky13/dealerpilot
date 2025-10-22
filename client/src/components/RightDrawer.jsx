import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function RightDrawer({ open, onClose, title, children, width = "420px" }) {
  // Lock body scroll while open (and restore on close/unmount)
  useEffect(() => {
    if (!open) return;
    const { overflow, paddingRight } = document.body.style;

    // prevent layout shift by compensating for scrollbar if present
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = overflow || "";
      document.body.style.paddingRight = paddingRight || "";
    };
  }, [open]);

  if (!open) return null;

  // Portal ensures the drawer is not affected by any parent stacking/transform contexts
  return createPortal(
    (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel (flush to top) */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 flex flex-col bg-[#0C1218] text-[#E6F1FF]
                       ring-1 ring-white/10 shadow-[0_0_40px_rgba(0,0,0,0.7)]"
            style={{ width }}
            initial={{ x: 64, opacity: 0.98 }}
            animate={{ x: 0, opacity: 1, transition: { type: "spring", stiffness: 280, damping: 26 } }}
            exit={{ x: 64, opacity: 0.98, transition: { duration: 0.18, ease: "easeOut" } }}
          >
            {/* Left edge divider to match app separators */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/15 via-white/8 to-white/15" />

            {/* Header */}
            <div className="flex items-center justify-between h-14 px-5 border-b border-white/10">
              <h3 className="text-sm font-semibold truncate">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </motion.aside>
        </div>
      </AnimatePresence>
    ),
    document.body
  );
}