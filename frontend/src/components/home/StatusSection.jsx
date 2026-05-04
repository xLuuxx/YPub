function StatusSection({ selectedCocktail, orderSteps }) {
    return (
        <section
            id="commande"
            aria-labelledby="commande-section-title"
            className="scroll-mt-20 py-10"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h2
                        id="commande-section-title"
                        className="text-2xl font-bold tracking-tight text-zinc-950"
                    >
                        Commande et suivi
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Commandez votre cocktail chez Y&apos;Pub et suivez l’avancement de votre demande.
                    </p>
                </div>

                <div className="rounded-[2rem] bg-zinc-950 py-10 text-white">
                    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                                    Détail cocktail
                                </p>
                                <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                                    {selectedCocktail.name}
                                </h3>
                            </div>

                            <img
                                src={selectedCocktail.image}
                                alt={`Présentation détaillée de ${selectedCocktail.name}`}
                                className="h-80 w-full rounded-[2rem] object-cover"
                            />

                            <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-5">
                                <h4 className="text-lg font-bold text-white">Ingrédients</h4>
                                <ul className="mt-3 grid gap-2 text-sm text-zinc-300">
                                    {selectedCocktail.ingredients.map((ingredient) => (
                                        <li
                                            key={ingredient}
                                            className="rounded-xl bg-zinc-800 px-3 py-2"
                                        >
                                            {ingredient}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
                                <h3 className="text-2xl font-bold tracking-tight text-white">
                                    Valider une commande
                                </h3>

                                <form className="mt-6 space-y-4">
                                    <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white">
                      Numéro de table
                    </span>
                                        <select className="min-h-12 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/20">
                                            <option>Table 01</option>
                                            <option>Table 02</option>
                                            <option>Table 03</option>
                                            <option>Table 04</option>
                                            <option>Table 05</option>
                                        </select>
                                    </label>

                                    <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-white">
                      Cocktail sélectionné
                    </span>
                                        <input
                                            type="text"
                                            value={selectedCocktail.name}
                                            readOnly
                                            className="min-h-12 w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 text-sm text-white"
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                                    >
                                        Confirmer la commande
                                    </button>
                                </form>
                            </div>

                            <aside className="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 sm:p-6">
                                <h3 className="text-2xl font-bold tracking-tight text-white">
                                    Suivi de commande
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-zinc-300">
                                    Retrouvez ici où en est votre commande.
                                </p>

                                <ol className="mt-6 grid gap-3" aria-label="Étapes de suivi">
                                    {orderSteps.map((step) => (
                                        <li
                                            key={step.label}
                                            className={`rounded-2xl border p-4 ${
                                                step.active
                                                    ? "border-violet-400 bg-zinc-900"
                                                    : "border-zinc-700 bg-zinc-900/70"
                                            }`}
                                        >
                                            <p
                                                className={`text-sm font-semibold ${
                                                    step.active ? "text-violet-300" : "text-white"
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                            <p className="mt-1 text-sm text-zinc-400">
                                                {step.active
                                                    ? "Étape actuellement affichée dans l’interface."
                                                    : "Étape suivante ou précédente du parcours client."}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default StatusSection;