import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";

/**
 * - Base grid stays put.
 * - Two overlay grid layers pull TOWARD the cursor with different strengths.
 * - Overlays are softly masked to a radial area around the cursor so the pull
 *   feels localized (like the grid is being tugged where the mouse is).
 */
export default function AnimatedGrid() {
  // Track raw mouse position
  const mx = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const my = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  // Smoothed position (silky movement)
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });

  // Derived offsets for the two pulling layers (stronger layer pulls more)
  const layer1x = useSpring(0, { stiffness: 120, damping: 20, mass: 0.4 });
  const layer1y = useSpring(0, { stiffness: 120, damping: 20, mass: 0.4 });
  const layer2x = useSpring(0, { stiffness: 120, damping: 20, mass: 0.4 });
  const layer2y = useSpring(0, { stiffness: 120, damping: 20, mass: 0.4 });

  // Mask around cursor so the pull feels local (bigger = wider influence)
  const R1 = 360; // outer radius
  const mask = useMotionTemplate`radial-gradient(
    circle at ${sx}px ${sy}px,
    rgba(255,255,255,0.95) 0%,
    rgba(255,255,255,0.8) 14%,
    rgba(255,255,255,0.45) 28%,
    rgba(255,255,255,0.15) 38%,
    rgba(255,255,255,0.0) ${R1}px
  )`;

  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Pull strengths — tweak divisors for more/less tug
      layer1x.set(dx / 14); // stronger, closer layer
      layer1y.set(dy / 14);
      layer2x.set(dx / 26); // weaker, farther layer
      layer2y.set(dy / 26);

      // Raw mouse for masking
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [layer1x, layer1y, layer2x, layer2y, mx, my]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,230,206,0.20),transparent_60%)]" />

      {/* BASE GRID (static) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dp-grid-base" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dp-grid-base)" />
      </svg>

      {/* SHIMMER (very subtle global motion) */}
      <motion.div
        className="absolute -inset-1 mix-blend-screen"
        initial={{ opacity: 0.22, y: 0 }}
        animate={{ opacity: [0.22, 0.34, 0.22], y: [-30, 0, -30] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(120deg, rgba(91,230,206,0.08), rgba(255,255,255,0.04), rgba(91,230,206,0.08))",
        }}
      />

      {/* PULL LAYER A (stronger, closer) */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: layer1x,
          y: layer1y,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dp-grid-pull-a" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dp-grid-pull-a)" />
        </svg>
      </motion.div>

      {/* PULL LAYER B (weaker, farther) */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: layer2x,
          y: layer2y,
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-22"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dp-grid-pull-b" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="white" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dp-grid-pull-b)" />
        </svg>
      </motion.div>
    </div>
  );
}