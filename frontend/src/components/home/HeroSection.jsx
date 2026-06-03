function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      <img
        src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/10 to-zinc-950" />

      <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-400">
          Y'Pub · Cocktails
        </p>

        <h1 className="mt-5 max-w-2xl text-5xl font-black leading-none tracking-tighter text-white sm:text-7xl">
          Ce soir,{' '}
          <span className="text-violet-400">commandez bien.</span>
        </h1>

        <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
          Parcourez la carte, choisissez votre cocktail, et passez commande depuis votre table.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#carte"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Voir la carte
          </a>
          <a
            href="#commande"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Commander
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
