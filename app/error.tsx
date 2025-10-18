"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-zinc-400 mb-6">{error.message}</p>
        <button onClick={reset} className="px-4 py-2 rounded-xl bg-white text-black">Try Again</button>
      </div>
    </main>
  );
}
