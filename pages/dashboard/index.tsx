import { useEffect, useState } from "react";

type Lead = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
};

type Email = {
  id: number;
  to: string;
  subject: string;
  body: string;
  status: string;
  leadId: number;
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch leads
  const fetchLeads = async () => {
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
  };

  // Fetch emails
  const fetchEmails = async () => {
    const res = await fetch("/api/emails");
    const data = await res.json();
    setEmails(data);
  };

  useEffect(() => {
    fetchLeads();
    fetchEmails();
  }, []);

  // Trigger AI email generation
  const generateEmailForLead = async (lead: Lead) => {
    setLoading(true);
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        userId: 1, // adjust if multi-user
        triggerAI: true,
        context: "Welcome email for new lead, introduce Infinity AI features."
      }),
    });
    if (res.ok) {
      await fetchLeads();
      await fetchEmails();
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Infinity AI Dashboard</h1>

      <h2>Leads</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{lead.firstName} {lead.lastName}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.status}</td>
              <td>
                <button
                  onClick={() => generateEmailForLead(lead)}
                  disabled={loading || lead.status === "followed-up"}
                >
                  {loading ? "Processing..." : "Generate AI Email"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Emails</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>To</th>
            <th>Subject</th>
            <th>Body</th>
            <th>Status</th>
            <th>Lead ID</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email.id}>
              <td>{email.id}</td>
              <td>{email.to}</td>
              <td>{email.subject}</td>
              <td>{email.body}</td>
              <td>{email.status}</td>
              <td>{email.leadId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

