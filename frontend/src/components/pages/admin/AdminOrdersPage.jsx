import { useEffect, useState } from 'react';
import api from '../../../lib/api';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Reçue' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'served', label: 'Servie' },
];

const STATUS_COLORS = {
  pending: 'bg-amber-500/15 text-amber-300',
  preparing: 'bg-violet-500/15 text-violet-300',
  served: 'bg-emerald-500/15 text-emerald-300',
};

function formatOrderId(id) {
  return `CMD-${String(id).padStart(4, '0')}`;
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/orders')
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    try {
      const { data } = await api.patch(`/api/orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? data : o)));
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  }

  async function removeOrder(id) {
    if (!confirm('Supprimer cette commande ?')) return;
    try {
      await api.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (editingOrder?.id === id) setEditingOrder(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  }

  async function saveEdit() {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.patch(`/api/orders/${editingOrder.id}`, {
        status: editingOrder.status,
      });
      setOrders((prev) => prev.map((o) => (o.id === data.id ? data : o)));
      setEditingOrder(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-zinc-400">Chargement…</p>;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
          Commandes
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Gestion des commandes</h2>
      </section>

      {orders.length === 0 && (
        <p className="text-zinc-400">Aucune commande.</p>
      )}

      <section className="grid gap-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{formatOrderId(order.id)}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                    {STATUS_OPTIONS.find((s) => s.value === order.status)?.label}
                  </span>
                </div>

                <p className="text-sm text-zinc-300">{order.table_num}</p>

                <ul className="space-y-0.5">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-sm text-zinc-300">
                      {item.cocktail_name} × {item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-zinc-500">
                  {new Date(order.created_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                  {order.user_identifier && ` · ${order.user_identifier}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div>
                  <label htmlFor={`order-status-${order.id}`} className="sr-only">
                    Statut de la commande {formatOrderId(order.id)}
                  </label>
                  <select
                    id={`order-status-${order.id}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="min-h-11 rounded-full border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-violet-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setEditingOrder({ ...order })}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Détails
                </button>

                <button
                  onClick={() => removeOrder(order.id)}
                  className="rounded-full border border-rose-400/30 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-order-title"
            className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
                  Édition
                </p>
                <h3 id="edit-order-title" className="mt-2 text-2xl font-black">
                  {formatOrderId(editingOrder.id)}
                </h3>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white hover:bg-white/10"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-1 text-sm font-semibold text-zinc-400">Table</p>
                <p className="text-sm">{editingOrder.table_num}</p>
              </div>

              <div>
                <p className="mb-1 text-sm font-semibold text-zinc-400">Cocktails</p>
                <ul className="space-y-1">
                  {editingOrder.items.map((item) => (
                    <li key={item.id} className="text-sm">
                      {item.cocktail_name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Statut</span>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder((prev) => ({ ...prev, status: e.target.value }))}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>

              {error && (
                <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>
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
                onClick={() => setEditingOrder(null)}
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
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

export default AdminOrdersPage;
