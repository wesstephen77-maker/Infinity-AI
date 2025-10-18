export default function Privacy() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose prose-invert">
      <h1>Privacy Policy</h1>
      <p>We respect your privacy. We collect emails for launch updates and product communication only. You can opt out anytime.</p>
      <h2>Data We Collect</h2>
      <ul>
        <li>Email addresses submitted via our waitlist form.</li>
        <li>Basic analytics (page views, referral sources).</li>
      </ul>
      <h2>Contact</h2>
      <p>Reach us at support@mynewinfinityai.com.</p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </main>
  );
}
