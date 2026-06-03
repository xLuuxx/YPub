import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const STATUS_LABELS = { pending: 'Reçue', preparing: 'En préparation', served: 'Servie' };
const STATUS_COLORS = {
  pending: 'text-amber-400',
  preparing: 'text-violet-400',
  served: 'text-emerald-400',
};
const STATUS_DOT = {
  pending: 'bg-amber-400',
  preparing: 'bg-violet-400 animate-pulse',
  served: 'bg-emerald-400',
};

function formatOrderId(id) {
  return `CMD-${String(id).padStart(4, '0')}`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api.get('/api/orders')
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function cancelOrder(id) {
    if (!confirm('Annuler cette commande ?')) return;
    setCancelling(id);
    try {
      await api.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'annulation");
    } finally {
      setCancelling(null);
    }
  }

  const active = orders.filter((o) => o.status !== 'served');
  const history = orders.filter((o) => o.status === 'served');

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Header />

      <div className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
            Mon compte
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
              {user.identifier}
            </h1>
            <button
              onClick={logout}
              className="text-sm text-zinc-500 transition hover:text-rose-400"
            >
              Déconnexion
            </button>
          </div>

          {!loading && active.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT[order.status]}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="mt-3 text-xl font-black tracking-tight">
                    {formatOrderId(order.id)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">{order.table_num}</p>
                  <ul className="mt-3 space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-sm text-zinc-300">
                        {item.cocktail_name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancelling === order.id}
                      className="mt-4 text-xs text-rose-400 transition hover:text-rose-300 disabled:opacity-50"
                    >
                      {cancelling === order.id ? 'Annulation…' : 'Annuler'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && <p className="text-sm text-zinc-400">Chargement…</p>}

        {!loading && orders.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-2xl font-black tracking-tight text-zinc-300">Aucune commande.</p>
            <p className="mt-2 text-sm text-zinc-500">
              Choisissez un cocktail et passez votre première commande.
            </p>
            <Link
              to="/#commande"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-violet-700 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-800"
            >
              Commander
            </Link>
          </div>
        )}

        {!loading && history.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
              Historique
            </h2>
            <div className="mt-4 divide-y divide-zinc-100">
              {history.map((order) => (
                <div key={order.id} className="flex items-start justify-between gap-4 py-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{formatOrderId(order.id)}</span>
                      <span className="text-xs text-zinc-400">{order.table_num}</span>
                    </div>
                    <ul className="mt-1 flex flex-wrap gap-x-3">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-sm text-zinc-500">
                          {item.cocktail_name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-400">{formatDate(order.created_at)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProfilePage;
