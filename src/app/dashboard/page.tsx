export default function DashboardHome() {
  const kpis = [
    { label: "Leads Today", value: 10 },
    { label: "Emails Sent", value: 24 },
    { label: "Calls Made", value: 12 },
    { label: "Appointments", value: 5 },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Personal Sales Assistant</h2>
      <p className="text-neutral-400">
        Command center for your sales day. Manage leads, draft AI emails, and track progress.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="text-neutral-400 text-sm">{k.label}</div>
            <div className="text-3xl font-bold mt-1">{k.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
