import { useState, useMemo } from 'react';
import CocktailCard from './CocktailCard';

function CocktailGrid({ cocktails, loading, onSelect }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return cocktails.filter((c) => {
      const matchesCategory = category === 'all' || c.category === category;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.ingredients?.some((i) => i.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [cocktails, search, category]);

  return (
    <section
      id="carte"
      aria-labelledby="carte-title"
      className="scroll-mt-20 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mb-6">
        <h2 id="carte-title" className="text-2xl font-bold tracking-tight text-zinc-950">
          Carte des cocktails
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Recherchez et filtrez pour trouver votre cocktail préféré !
        </p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-800">
            Rechercher un cocktail
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ex. spritz, fruité, citron…"
            className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-800">
            Filtrer par catégorie
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm text-zinc-950 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-100"
          >
            <option value="all">Toutes les catégories</option>
            <option value="Signature">Signature</option>
            <option value="Fruité">Fruité</option>
            <option value="Sans alcool">Sans alcool</option>
            <option value="Classique">Classique</option>
          </select>
        </label>
      </div>

      {loading && <p className="text-sm text-zinc-500">Chargement de la carte…</p>}

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-zinc-500">Aucun cocktail ne correspond à votre recherche.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((cocktail) => (
          <CocktailCard key={cocktail.id} cocktail={cocktail} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

export default CocktailGrid;
