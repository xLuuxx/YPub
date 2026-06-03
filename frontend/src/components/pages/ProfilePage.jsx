import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const STATUS_LABELS = {
  pending: 'Reçue',
  preparing: 'En préparation',
  served: 'Servie',
};

const STATUS_COLORS = {
  pending: 'bg-amber-500/15 text-amber-700',
  preparing: 'bg-violet-500/15 text-violet-700',
  served: 'bg-emerald-500/15 text-emerald-700',
};

function formatOrderId(id) {
  return `CMD-${String(id).padStart(4, '0')}`;
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
      alert(err.response?.data?.error || 'Erreur lors de l\'annulation');
    } finally {
      setCancelling(null);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-700">
              Compte
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Bonjour, {user.identifier}
            </h1>
          </div>

          <button
            onClick={logout}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:border-rose-200 hover:text-rose-600"
          >
            Déconnexion
          </button>
        </div>

        <section>
          <h2 className="mb-4 text-xl font-bold">Mes commandes</h2>

          {loading && (
            <p className="text-sm text-zinc-500">Chargement…</p>
          )}

          {!loading && orders.length === 0 && (
            <div className="rounded-[2rem] border border-zinc-200 p-8 text-center">
              <p className="text-zinc-500">Aucune commande pour l'instant.</p>
              <Link
                to="/#commande"
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800"
              >
                Commander
              </Link>
            </div>
          )}

          <div className="grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-[2rem] border border-zinc-200 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold">{formatOrderId(order.id)}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600">{order.table_num}</p>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-sm text-zinc-700">
                          {item.cocktail_name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-zinc-400">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancelling === order.id}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {cancelling === order.id ? 'Annulation…' : 'Annuler'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProfilePage;
