// src/components/SyncVisualizer.jsx
import { useEffect, useRef } from "react";

export default function SyncVisualizer({ height = "100%" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    let raf;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight * 0.9; // adjust hero height fraction
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const colors = ["#5BE6CE", "#7EE7F5", "#46CBB4"];

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const midY = h / 2;
      const baseAmp = h * 0.15;
      const baseFreq = 0.01;
      const speed = 0.01;

      for (let i = 0; i < colors.length; i++) {
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y =
            midY +
            Math.sin(x * baseFreq + t * speed + i) *
              baseAmp *
              Math.cos((x / w) * Math.PI);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5 - i * 0.1;
        ctx.stroke();
      }

      t += 1;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full absolute inset-0" />;
}