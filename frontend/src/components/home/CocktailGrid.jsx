import CocktailCard from "./CocktailCard";

function CocktailGrid({ cocktails }) {
    return (
        <section
            id="carte"
            aria-labelledby="carte-title"
            className="scroll-mt-20 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
            <div className="mb-6">
                <h2
                    id="carte-title"
                    className="text-2xl font-bold tracking-tight text-zinc-950"
                >
                    Carte des cocktails
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Rechercher et filtrer pour trouver votre coktails préféré !
                </p>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
                <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-800">
            Rechercher un cocktail
          </span>
                    <input
                        type="text"
                        placeholder="Ex. spritz, fruité, citron..."
                        className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-100"
                    />
                </label>

                <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-800">
            Filtrer par catégorie
          </span>
                    <select
                        className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-950 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-100"
                        defaultValue="all"
                    >
                        <option value="all">Toutes les catégories</option>
                        <option value="signature">Signature</option>
                        <option value="fruite">Fruité</option>
                        <option value="sans-alcool">Sans alcool</option>
                    </select>
                </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cocktails.map((cocktail) => (
                    <CocktailCard key={cocktail.id} cocktail={cocktail} />
                ))}
            </div>
        </section>
    );
}

export default CocktailGrid;