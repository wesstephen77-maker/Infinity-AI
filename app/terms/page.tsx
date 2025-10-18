export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose prose-invert">
      <h1>Terms of Use</h1>
      <p>By using Infinity AI, you agree to use the site legally and responsibly. We may update these terms from time to time.</p>
      <h2>Beta Software</h2>
      <p>During beta, features may change and outages may occur. We appreciate your feedback.</p>
      <h2>Contact</h2>
      <p>support@mynewinfinityai.com</p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </main>
  );
}
