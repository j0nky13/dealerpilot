import { motion, useReducedMotion } from "framer-motion";

/**
 * FancyLoader
 * - Polished full-screen loader with subtle sync motif
 * - Accessible (role=status, aria-live) + reduced-motion friendly
 *
 * Props:
 *  - title?: string
 *  - subtitle?: string
 *  - logoSrc?: string (defaults to /logo.svg)
 */
export default function FancyLoader({
  title = "Synchronising…",
  subtitle = "Warming up your workspace",
  logoSrc = "/logo.png",
}) {
  const prefersReduced = useReducedMotion();

  // When reduced motion is requested, drastically simplify animations.
  const pulseTransition = prefersReduced
    ? { duration: 0, repeat: 0 }
    : { duration: 1.6, repeat: Infinity, ease: "easeInOut" };

  const beamTransition = prefersReduced
    ? { duration: 0, repeat: 0 }
    : { duration: 1.8, repeat: Infinity, ease: "easeInOut" };

  const shimmerTransition = prefersReduced
    ? { duration: 0, repeat: 0 }
    : { duration: 1.6, repeat: Infinity, ease: "easeInOut" };

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-[#0B0F14] text-white"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* subtle background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-[#5BE6CE]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-md px-8">
        {/* logo / mark */}
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
          <img src={logoSrc} alt="App logo" className="h-6 opacity-90" />
        </div>

        {/* headline */}
        <h1 className="text-center text-xl font-semibold">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-center text-sm text-[#9FB0C6]">{subtitle}</p>
        ) : null}

        {/* animated “sync” motif */}
        <div className="mt-8 relative h-24">
          {/* nodes */}
          <div className="absolute inset-0 grid grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <motion.span
                  className="h-2 w-2 rounded-full bg-white/30"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={
                    prefersReduced
                      ? { scale: 0.9, opacity: 0.7 }
                      : { scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }
                  }
                  transition={
                    prefersReduced ? { duration: 0 } : { ...pulseTransition, delay: i * 0.12 }
                  }
                />
              </div>
            ))}
          </div>

          {/* flowing link “beam” */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#5BE6CE] to-transparent"
            initial={{ opacity: 0.3, scaleX: 0.2 }}
            animate={prefersReduced ? { opacity: 0.4, scaleX: 1 } : { opacity: [0.3, 0.6, 0.3], scaleX: [0.2, 1, 0.2] }}
            transition={beamTransition}
          />

          {/* shimmer bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 rounded-full bg-white/5 ring-1 ring-white/10 overflow-hidden">
            <motion.div
              className="h-full w-3/3 bg-[#5BE6CE]"
              initial={{ x: "-100%" }}
              animate={prefersReduced ? { x: "0%" } : { x: ["-100%", "100%"] }}
              transition={shimmerTransition}
            />
          </div>
        </div>

        {/* small helper */}
        <p className="mt-6 text-center text-[11px] text-[#7C90A8]">
          If this takes longer than expected, refresh the page.
        </p>
      </div>
    </div>
  );
}