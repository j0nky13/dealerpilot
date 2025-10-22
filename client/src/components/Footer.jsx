export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9FB0C6]">
        <div className="flex items-center gap-3">
          {/* <img src="/logo.svg" alt="Synchronising" className="h-6 w-auto" /> */}
          <span>&copy; 2025 Synchronising</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="hover:text-[#E6F1FF]">Privacy</a>
          <a href="#" className="hover:text-[#E6F1FF]">Terms</a>
          <a href="#" className="hover:text-[#E6F1FF]">Contact</a>
        </nav>
      </div>
    </footer>
  );
}