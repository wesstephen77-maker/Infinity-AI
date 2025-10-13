import Link from "next/link";

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-12 bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <aside className="col-span-2 border-r border-neutral-800 p-6">
        <h1 className="text-xl font-bold mb-6">∞ Infinity AI</h1>
        <nav className="space-y-3 text-neutral-300">
          <Link className="block hover:text-white" href="/dashboard">Dashboard</Link>
          <Link className="block hover:text-white" href="/leads">Leads & Contacts</Link>
          <Link className="block hover:text-white" href="/assistant">AI Assistant</Link>
          <Link className="block hover:text-white" href="/analytics">Analytics</Link>
          <Link className="block hover:text-white" href="/agenda">Agenda</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="col-span-10 p-8">{children}</main>
    </div>
  );
}
