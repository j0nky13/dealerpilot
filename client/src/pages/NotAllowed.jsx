export default function NotAllowed() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#0B0F14] text-white px-6">
      <div className="w-full max-w-md text-center rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Access restricted</h1>
        <p className="mt-2 text-sm text-[#9FB0C6]">
          You don’t have permission to view this page. If you believe this is a mistake,
          please contact your manager or administrator.
        </p>
        <a
          href="/app/today"
          className="mt-6 inline-block rounded-lg bg-[#5BE6CE] px-5 py-2 font-medium text-black hover:brightness-95"
        >
          Go to Today
        </a>
      </div>
    </div>
  );
}