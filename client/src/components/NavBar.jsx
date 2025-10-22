import { useState } from "react";
import { Link } from "react-router-dom";
import ContactModal from "./ContactModal.jsx";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F14]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0B0F14]/60">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="DealerPilot" className="h-7 w-auto" />
          <span className="sr-only">DealerPilot</span>
        </Link>
        <nav className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition">Contact</button>
          <Link to="/login" className="px-3 py-2 rounded-xl bg-[#5BE6CE] text-black font-medium hover:brightness-95 transition">Login</Link>
        </nav>
      </div>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}