export default function Viewport({ children }) {
  return (
    // Fixed full-screen scroll container with dark bg
    <div className="fixed inset-0 overflow-y-auto bg-[#0B0F14] text-[#E6F1FF]">
      {children}
    </div>
  );
}