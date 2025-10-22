export default function Panel({ title, right, children, className = "" }) {
  return (
    <section className={`rounded-2xl bg-[#0D131B] ring-1 ring-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] ${className}`}>
      <header className="flex items-center justify-between px-5 h-12 border-b border-white/10">
        <h3 className="text-sm font-semibold">{title}</h3>
        {right}
      </header>
      <div className="p-5">
        {children}
      </div>
    </section>
  );
}