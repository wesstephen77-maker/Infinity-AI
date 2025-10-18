import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Infinity AI</h1>
        <p className="text-lg md:text-xl text-zinc-300">
          Empower your workforce with <span className="font-medium">infinite possibilities</span>.
        </p>
        <Suspense>
          <form className="mt-4 flex gap-2 justify-center" action="/api/subscribe" method="POST">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full max-w-sm px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:outline-none"
            />
            <button type="submit" className="px-5 py-3 rounded-xl bg-white text-black font-medium">
              Notify Me
            </button>
          </form>
        </Suspense>
        <p className="text-sm text-zinc-500">
          Coming soon to <span className="underline">MyNewInfinityAI.com</span>
        </p>
      </div>
    </main>
  );
}
