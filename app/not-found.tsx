/* eslint-disable @next/next/no-html-link-for-pages */
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
        <p className="text-zinc-400 mb-6">Let’s get you back to home.</p>
        <a href="/" className="px-4 py-2 rounded-xl bg-white text-black">Go Home</a>
      </div>
    </main>
  );
}
