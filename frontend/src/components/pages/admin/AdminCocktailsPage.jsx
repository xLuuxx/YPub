import { useEffect, useState } from 'react';
import api from '../../../lib/api';

const EMPTY_FORM = {
  name: '',
  category: 'Signature',
  price: '',
  description: '',
  origin: '',
  image: '',
  story: '',
  ingredients: '',
};

function AdminCocktailsPage() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCocktail, setEditingCocktail] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [editError, setEditError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/cocktails')
      .then((res) => setCocktails(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function parseIngredients(str) {
    return str.split(',').map((s) => s.trim()).filter(Boolean);
  }

  async function addCocktail(e) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/cocktails', {
        ...form,
        price: parseFloat(form.price),
        ingredients: parseIngredients(form.ingredients),
      });
      setCocktails((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Erreur lors de l\'ajout');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeCocktail(id) {
    if (!confirm('Supprimer ce cocktail ?')) return;
    try {
      await api.delete(`/api/cocktails/${id}`);
      setCocktails((prev) => prev.filter((c) => c.id !== id));
      if (editingCocktail?.id === id) setEditingCocktail(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  }

  function startEdit(cocktail) {
    setEditingCocktail({
      ...cocktail,
      price: String(cocktail.price),
      ingredients: cocktail.ingredients.join(', '),
    });
    setEditError('');
  }

  async function saveEdit() {
    setSaving(true);
    setEditError('');
    try {
      const { data } = await api.put(`/api/cocktails/${editingCocktail.id}`, {
        name: editingCocktail.name,
        category: editingCocktail.category,
        price: parseFloat(editingCocktail.price),
        description: editingCocktail.description,
        available: editingCocktail.available,
        origin: editingCocktail.origin,
        image: editingCocktail.image,
        story: editingCocktail.story,
        ingredients: parseIngredients(editingCocktail.ingredients),
      });
      setCocktails((prev) => prev.map((c) => (c.id === data.id ? data : c)));
      setEditingCocktail(null);
    } catch (err) {
      setEditError(err.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-zinc-400">Chargement…</p>;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">Carte</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Gestion de la carte</h2>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={addCocktail}
          className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-2xl font-bold">Ajouter un cocktail</h3>

          {[
            { key: 'name', label: 'Nom', placeholder: 'Violet Spritz' },
            { key: 'price', label: 'Prix (€)', placeholder: '8.50', type: 'number' },
            { key: 'origin', label: 'Origine', placeholder: 'France' },
            { key: 'image', label: 'URL image', placeholder: 'https://...' },
          ].map(({ key, label, placeholder, type }) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-semibold">{label}</span>
              <input
                type={type || 'text'}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
              />
            </label>
          ))}

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
            <span className="mb-2 block text-sm font-semibold">Ingrédients (séparés par des virgules)</span>
            <input
              value={form.ingredients}
              onChange={(e) => setForm((prev) => ({ ...prev, ingredients: e.target.value }))}
              placeholder="Citron, Menthe, Eau gazeuse"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows="3"
              placeholder="Description courte"
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Histoire</span>
            <textarea
              value={form.story}
              onChange={(e) => setForm((prev) => ({ ...prev, story: e.target.value }))}
              rows="3"
              placeholder="L'histoire de ce cocktail…"
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
            />
          </label>

          {formError && (
            <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{formError}</p>
          )}

          <button
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold hover:bg-violet-800 disabled:opacity-60"
          >
            {submitting ? 'Ajout…' : 'Ajouter'}
          </button>
        </form>

        <div className="space-y-4">
          {cocktails.length === 0 && <p className="text-zinc-400">Aucun cocktail.</p>}
          {cocktails.map((cocktail) => (
            <article
              key={cocktail.id}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold">{cocktail.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      cocktail.available ? 'bg-emerald-500/15 text-emerald-300' : 'bg-zinc-700 text-zinc-300'
                    }`}>
                      {cocktail.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">
                    {cocktail.category} · {Number(cocktail.price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{cocktail.description}</p>
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
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">Édition</p>
                <h3 id="edit-cocktail-title" className="mt-2 text-2xl font-black">Modifier le cocktail</h3>
              </div>
              <button
                onClick={() => setEditingCocktail(null)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300 hover:bg-white/10"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { key: 'name', label: 'Nom' },
                { key: 'price', label: 'Prix (€)', type: 'number' },
                { key: 'origin', label: 'Origine' },
                { key: 'image', label: 'URL image' },
              ].map(({ key, label, type }) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-semibold">{label}</span>
                  <input
                    type={type || 'text'}
                    value={editingCocktail[key] ?? ''}
                    onChange={(e) => setEditingCocktail((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                  />
                </label>
              ))}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Catégorie</span>
                <select
                  value={editingCocktail.category}
                  onChange={(e) => setEditingCocktail((prev) => ({ ...prev, category: e.target.value }))}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                >
                  <option>Signature</option>
                  <option>Fruité</option>
                  <option>Sans alcool</option>
                  <option>Classique</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Ingrédients (séparés par des virgules)</span>
                <input
                  value={editingCocktail.ingredients}
                  onChange={(e) => setEditingCocktail((prev) => ({ ...prev, ingredients: e.target.value }))}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Description</span>
                <textarea
                  value={editingCocktail.description ?? ''}
                  onChange={(e) => setEditingCocktail((prev) => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Histoire</span>
                <textarea
                  value={editingCocktail.story ?? ''}
                  onChange={(e) => setEditingCocktail((prev) => ({ ...prev, story: e.target.value }))}
                  rows="3"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-violet-500"
                />
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingCocktail.available}
                  onChange={(e) => setEditingCocktail((prev) => ({ ...prev, available: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-zinc-900 text-violet-600"
                />
                <span className="text-sm font-medium">Cocktail disponible</span>
              </label>

              {editError && (
                <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{editError}</p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-60"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
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
