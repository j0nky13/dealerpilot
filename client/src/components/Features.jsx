export default function Features() {
  const features = [
    {
      title: "Unified Communication",
      text: "Every lead, note, and update stays visible to everyone on your team.",
    },
    {
      title: "Centralised Dashboard",
      text: "Track performance, follow-ups, and opportunities in one clean view.",
    },
    {
      title: "Live Updates",
      text: "Changes sync instantly — no delays or manual refreshes.",
    },
    {
      title: "Accessible Anywhere",
      text: "Cloud-based platform built for desktop, tablet, or mobile.",
    },
    {
      title: "Role-Based Access",
      text: "Different tools and visibility for Sales, BDC, and Managers.",
    },
    {
      title: "Zero Setup Hassle",
      text: "Works right out of the box with minimal onboarding required.",
    },
  ];

  return (
    <section className="bg-[#0B0F14] py-20 px-6 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-semibold mb-12">Why teams choose Synchronising</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/5 border border-white/10 p-6 text-left hover:bg-white/[0.07] transition">
              <h3 className="text-lg font-semibold mb-2 text-[#5BE6CE]">{f.title}</h3>
              <p className="text-sm text-[#9FB0C6]">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}