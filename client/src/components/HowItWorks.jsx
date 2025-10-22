// src/components/HowItWorks.jsx
export default function HowItWorks() {
  const steps = [
    { title: "Connect your team", text: "Everyone joins with one secure link — no installs, no hassle." },
    { title: "Share information", text: "Leads, notes, and updates flow to the right people instantly." },
    { title: "Track activity", text: "Dashboards give managers and reps clear visibility of progress." },
    { title: "Stay aligned", text: "Real-time updates keep everyone moving together toward the same goals." },
  ];

  return (
    <section className="bg-[#0E141B] py-20 px-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold mb-10">How everything stays in sync</h2>

        {/* Mobile: vertical timeline */}
        <ol className="sm:hidden relative border-l border-white/10 ml-4 space-y-8">
          {steps.map((s, i) => (
            <li key={i} className="relative pl-6">
              <span className="absolute -left-3 top-0 grid place-items-center h-6 w-6 rounded-full bg-[#5BE6CE] text-black text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-[#9FB0C6]">{s.text}</p>
            </li>
          ))}
        </ol>

        {/* Desktop: 4-column flow with connectors */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#5BE6CE] text-black font-bold">
                {i + 1}
              </div>
              <h3 className="text-base font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-[#9FB0C6]">{s.text}</p>

              {/* connector line (not shown on last card) */}
              {i !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-3 h-[2px] w-6 bg-gradient-to-r from-[#5BE6CE]/70 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}