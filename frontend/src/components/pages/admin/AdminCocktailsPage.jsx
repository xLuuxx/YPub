import { useState } from "react";
import { cocktailsData } from "../../../data/adminData.js";

function AdminCocktailsPage() {
    const [cocktails, setCocktails] = useState(cocktailsData);
    const [editingCocktail, setEditingCocktail] = useState(null);
    const [form, setForm] = useState({
        name: "",
        category: "Signature",
        price: "",
        description: "",
    });

    const addCocktail = (e) => {
        e.preventDefault();

        const newCocktail = {
            id: Date.now(),
            ...form,
            available: true,
            ingredients: [],
        };

        setCocktails((prev) => [newCocktail, ...prev]);

        setForm({
            name: "",
            category: "Signature",
            price: "",
            description: "",
        });
    };

    const removeCocktail = (id) => {
        setCocktails((prev) => prev.filter((cocktail) => cocktail.id !== id));
        if (editingCocktail?.id === id) {
            setEditingCocktail(null);
        }
    };

    const startEdit = (cocktail) => {
        setEditingCocktail({ ...cocktail });
    };

    const handleEditChange = (field, value) => {
        setEditingCocktail((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const saveEdit = () => {
        setCocktails((prev) =>
            prev.map((cocktail) =>
                cocktail.id === editingCocktail.id ? editingCocktail : cocktail
            )
        );
        setEditingCocktail(null);
    };

    return (
        <div className="space-y-8">
            <section>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
                    Carte
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                    Gestion de la carte
                </h2>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <form
                    onSubmit={addCocktail}
                    className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6"
                >
                    <h3 className="text-2xl font-bold">Ajouter un cocktail</h3>

                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Nom</span>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Nom"
                            className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Prix</span>
                        <input
                            value={form.price}
                            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                            placeholder="8,50 €"
                            className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Catégorie</span>
                        <select
                            value={form.category}
                            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                            className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
                        >
                            <option>Signature</option>
                            <option>Fruité</option>
                            <option>Sans alcool</option>
                            <option>Classique</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold">Description</span>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            rows="4"
                            placeholder="Description"
                            className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
                        />
                    </label>

                    <button className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold hover:bg-violet-800">
                        Ajouter
                    </button>
                </form>

                <div className="space-y-4">
                    {cocktails.map((cocktail) => (
                        <article
                            key={cocktail.id}
                            className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="text-xl font-bold">{cocktail.name}</h3>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                cocktail.available
                                                    ? "bg-emerald-500/15 text-emerald-300"
                                                    : "bg-zinc-700 text-zinc-300"
                                            }`}
                                        >
                      {cocktail.available ? "Disponible" : "Indisponible"}
                    </span>
                                    </div>

                                    <p className="mt-1 text-sm text-zinc-400">
                                        {cocktail.category} · {cocktail.price}
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                                        {cocktail.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => startEdit(cocktail)}
                                        className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        onClick={() => removeCocktail(cocktail.id)}
                                        className="rounded-full border border-rose-400/30 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {editingCocktail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-cocktail-title"
                        className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
                                    Édition
                                </p>
                                <h3 id="edit-cocktail-title" className="mt-2 text-2xl font-black">
                                    Modifier le cocktail
                                </h3>
                            </div>

                            <button
                                onClick={() => setEditingCocktail(null)}
                                className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300 hover:bg-white/10"
                            >
                                Fermer
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Nom</span>
                                <input
                                    value={editingCocktail.name}
                                    onChange={(e) => handleEditChange("name", e.target.value)}
                                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Prix</span>
                                <input
                                    value={editingCocktail.price}
                                    onChange={(e) => handleEditChange("price", e.target.value)}
                                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Catégorie</span>
                                <select
                                    value={editingCocktail.category}
                                    onChange={(e) => handleEditChange("category", e.target.value)}
                                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                                >
                                    <option>Signature</option>
                                    <option>Fruité</option>
                                    <option>Sans alcool</option>
                                    <option>Classique</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Description</span>
                                <textarea
                                    value={editingCocktail.description}
                                    onChange={(e) => handleEditChange("description", e.target.value)}
                                    rows="4"
                                    className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-violet-500"
                                />
                            </label>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={editingCocktail.available}
                                    onChange={(e) => handleEditChange("available", e.target.checked)}
                                    className="h-4 w-4 rounded border-white/20 bg-zinc-900 text-violet-600"
                                />
                                <span className="text-sm font-medium">Cocktail disponible</span>
                            </label>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={saveEdit}
                                className="rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
                            >
                                Enregistrer
                            </button>

                            <button
                                onClick={() => setEditingCocktail(null)}
                                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCocktailsPage;