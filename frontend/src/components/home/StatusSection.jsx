import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const ORDER_STEPS = [
  { key: 'pending', label: 'Commande reçue' },
  { key: 'preparing', label: 'En préparation' },
  { key: 'served', label: 'Servie' },
];

const TABLES = ['Table 01', 'Table 02', 'Table 03', 'Table 04', 'Table 05'];

function StatusSection({ selectedCocktail }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tableNum, setTableNum] = useState(TABLES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!selectedCocktail) return;

    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/orders', {
        table_num: tableNum,
        items: [{ cocktail_id: selectedCocktail.id, quantity: 1 }],
      });
      setConfirmedOrder(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  }

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
            Commandez votre cocktail chez Y&apos;Pub et suivez l'avancement de votre demande.
          </p>
        </div>

        <div className="rounded-[2rem] bg-zinc-950 py-10 text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              {selectedCocktail ? (
                <>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                      Cocktail sélectionné
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                      {selectedCocktail.name}
                    </h3>
                  </div>

                  {selectedCocktail.image && (
                    <img
                      src={selectedCocktail.image}
                      alt={`Présentation de ${selectedCocktail.name}`}
                      className="h-80 w-full rounded-[2rem] object-cover"
                    />
                  )}

                  {selectedCocktail.ingredients?.length > 0 && (
                    <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-5">
                      <h4 className="text-lg font-bold text-white">Ingrédients</h4>
                      <ul className="mt-3 grid gap-2 text-sm text-zinc-300">
                        {selectedCocktail.ingredients.map((ingredient) => (
                          <li key={ingredient} className="rounded-xl bg-zinc-800 px-3 py-2">
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center py-12">
                  <p className="text-center text-zinc-400">
                    Sélectionnez un cocktail dans la carte pour commencer.
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Valider une commande
                </h3>

                {confirmedOrder ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-emerald-500/10 p-4">
                      <p className="font-semibold text-emerald-300">Commande confirmée !</p>
                      <p className="mt-1 text-sm text-zinc-300">
                        Référence : CMD-{String(confirmedOrder.id).padStart(4, '0')}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to="/profile"
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800"
                      >
                        Suivre ma commande
                      </Link>
                      <button
                        onClick={() => setConfirmedOrder(null)}
                        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
                      >
                        Nouvelle commande
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-white">
                        Numéro de table
                      </span>
                      <select
                        value={tableNum}
                        onChange={(e) => setTableNum(e.target.value)}
                        className="min-h-12 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-white focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
                      >
                        {TABLES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-white">
                        Cocktail sélectionné
                      </span>
                      <input
                        type="text"
                        value={selectedCocktail?.name ?? 'Aucun cocktail sélectionné'}
                        readOnly
                        className="min-h-12 w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 text-sm text-white"
                      />
                    </label>

                    {error && (
                      <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                        {error}
                      </p>
                    )}

                    {!user && (
                      <p className="text-sm text-zinc-400">
                        <Link to="/login" className="text-violet-400 hover:underline">Connectez-vous</Link>{' '}
                        pour passer une commande.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !selectedCocktail || !user}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:opacity-60"
                    >
                      {submitting ? 'Confirmation…' : 'Confirmer la commande'}
                    </button>
                  </form>
                )}
              </div>

              <aside className="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 sm:p-6">
                <h3 className="text-2xl font-bold tracking-tight text-white">Suivi de commande</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {user
                    ? 'Retrouvez le détail de vos commandes sur votre profil.'
                    : 'Connectez-vous pour suivre vos commandes.'}
                </p>

                {user ? (
                  <Link
                    to="/profile"
                    className="mt-4 inline-flex items-center justify-center rounded-2xl border border-violet-400/30 px-4 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-500/10"
                  >
                    Voir mes commandes
                  </Link>
                ) : (
                  <ol className="mt-6 grid gap-3" aria-label="Étapes de suivi">
                    {ORDER_STEPS.map((step, i) => (
                      <li
                        key={step.key}
                        className={`rounded-2xl border p-4 ${
                          i === 0 ? 'border-violet-400 bg-zinc-900' : 'border-zinc-700 bg-zinc-900/70'
                        }`}
                      >
                        <p className={`text-sm font-semibold ${i === 0 ? 'text-violet-300' : 'text-white'}`}>
                          {step.label}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatusSection;
