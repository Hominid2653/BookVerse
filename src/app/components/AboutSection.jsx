export default function AboutSection() {
  return (
    <section className="mx-auto max-w-4xl space-y-8 rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">About</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          About BookVerse
        </h1>
      </div>

      <div className="space-y-6 text-lg leading-8 text-slate-800">
        <p>
          Launched in 2026, our digital library is designed around pure reading pleasure.
          We believe getting into a great book should be effortless, which is why you can
          enjoy a completely account-free experience.
        </p>
        <p>
          No sign-ups, no passwords—just instant access. Dive right in to preview a diverse
          collection of books and discover your next favorite read with zero hassle.
        </p>
      </div>
    </section>
  )
}
