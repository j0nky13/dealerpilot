import SyncVisualizer from "./SyncVisualizer.jsx";

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#0B0F14] text-white h-[90vh] min-h-[560px] flex items-center"
      aria-label="Synchronising hero"
    >
      {/* Full-bleed sync animation */}
      <div className="absolute inset-0 -z-10">
        <SyncVisualizer />
      </div>

      {/* Soft overlays / glows */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent" />
        <div className="absolute -top-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#5BE6CE]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-4xl sm:text-6xl font-semibold leading-tight">
          Synchronising your business — <br />
          <span className="text-[#5BE6CE]">from leads to performance.</span>
        </h1>

        <p className="mt-6 text-lg text-[#9FB0C6] max-w-2xl mx-auto">
          A connected workspace where managers, sales teams, and departments stay aligned in real time.
          Keep every process, every task, and every person in sync.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            className="bg-[#5BE6CE] text-black px-6 py-3 rounded-lg font-medium hover:brightness-95 transition"
          >
            Request Demo
          </a>
          <a
            href="/login"
            className="border border-white/10 bg-white/5 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition"
          >
            Join Beta
          </a>
        </div>
      </div>
    </section>
  );
}