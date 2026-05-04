function HeroSection({ selectedCocktail }) {
    return (
        <section className="scroll-mt-20 bg-gradient-to-b from-violet-50 to-white">
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:items-center lg:px-8">
                <div className="space-y-5">
          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
            Bienvenue chez Y'Pub.
          </span>

                    <h1 className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
                        Consultez notre carte de boissons !
                    </h1>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#carte"
                            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                        >
                            Voir la carte
                        </a>
                        <a
                            href="#commande"
                            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:border-violet-300 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                        >
                            Commander
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;