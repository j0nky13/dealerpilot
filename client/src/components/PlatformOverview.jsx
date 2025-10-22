export default function PlatformOverview() {
  return (
    <section className="bg-[#0B0F14] py-20 px-6 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-semibold mb-6">Your entire operation — connected</h2>
        <p className="text-[#9FB0C6] max-w-3xl mx-auto mb-10">
          Synchronising brings your leads, follow-ups, and performance data into one simple, organised view.
          It’s not just another CRM — it’s the layer that keeps your workflow smooth, transparent, and efficient.
        </p>

        <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-2 shadow-lg backdrop-blur">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#0D131B]">
            <img
              src="/preview2.png"
              alt="Synchronising dashboard preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}