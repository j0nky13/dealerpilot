export default function CTA() {
  return (
    <section className="relative py-20 bg-[#0E141B] text-white text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-4xl px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold">Start synchronising today</h2>
        <p className="mt-3 text-[#9FB0C6] max-w-2xl mx-auto">
          Join the private beta and see how much smoother your day runs when every team stays in sync.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="/contact" className="bg-[#5BE6CE] text-black px-6 py-3 rounded-lg font-medium hover:brightness-95 transition">
            Request Demo
          </a>
          <a href="/login" className="border border-white/10 bg-white/5 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
            Join Beta
          </a>
        </div>
        {/* <p className="mt-6 text-xs text-[#9FB0C6]">© 2025 Marsh Monster · Synchronising.com</p> */}
      </div>
    </section>
  );
}