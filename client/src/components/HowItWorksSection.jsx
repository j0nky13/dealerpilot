export default function HowItWorks() {
  const steps = [
    { title: "Connect your team", text: "Everyone joins with one secure link — no installs, no hassle." },
    { title: "Share information", text: "Leads, notes, and activity updates flow to the right people instantly." },
    { title: "Track activity", text: "Dashboards give managers and reps clear visibility of progress." },
    { title: "Stay aligned", text: "Real-time updates keep everyone moving together toward the same goals." },
  ];

  return (
    <section className="bg-[#0E141B] py-20 px-6 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-semibold mb-12">How everything stays in sync</h2>
        <div className="flex flex-col sm:flex-row justify-center items-start gap-10 sm:gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative flex-1 min-w-[200px]">
              <div className="text-4xl text-[#5BE6CE] font-bold mb-3">{i + 1}</div>
              <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-[#9FB0C6] max-w-xs mx-auto">{s.text}</p>
              {i !== steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 right-[-3rem] w-12 h-[1px] bg-gradient-to-r from-[#5BE6CE]/70 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}