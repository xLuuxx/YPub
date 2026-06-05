function CocktailCard({ cocktail, onSelect }) {
  const price = Number(cocktail.price).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });

  const imageUrl = cocktail.image
      ? (cocktail.image.startsWith('http')
          ? cocktail.image
          : `http://localhost:3000${cocktail.image}`)
      : null;

  return (
      <article
          className="scroll-mt-20 overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm"
          aria-labelledby={`cocktail-title-${cocktail.id}`}
      >
        {imageUrl && (
            <img
                src={imageUrl}
                alt={cocktail.name}
                className="h-56 w-full object-cover"
            />
        )}

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            {cocktail.category}
          </span>
            <span className="text-sm font-bold text-zinc-950">{price}</span>
          </div>

          <div>
            <h3
                id={`cocktail-title-${cocktail.id}`}
                className="text-xl font-bold text-zinc-950"
            >
              {cocktail.name}
            </h3>
            {(cocktail.story || cocktail.description) && (
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {cocktail.story || cocktail.description}
                </p>
            )}
          </div>

          <button
              type="button"
              onClick={() => onSelect?.(cocktail)}
              disabled={!cocktail.available}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cocktail.available ? 'Sélectionner' : 'Indisponible'}
          </button>
        </div>
      </article>
  );
}

export default CocktailCard;