export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),linear-gradient(135deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-6 shadow-2xl shadow-blue-950/40 sm:p-10 lg:p-16">
        <div className="w-full max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-200 backdrop-blur">
            AI-powered YouTube SEO
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
            CreatorPilot AI
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Generate YouTube SEO in Seconds
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950/70 p-3 shadow-xl shadow-black/30 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter your YouTube video topic..."
                className="h-14 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-base text-white outline-none ring-0 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white/15"
              />
              <button className="h-14 rounded-xl bg-blue-600 px-6 text-base font-semibold text-white transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950">
                Generate SEO
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Titles & descriptions
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Tags & hashtags
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Better discoverability
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
