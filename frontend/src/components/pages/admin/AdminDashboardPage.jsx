import { useEffect, useState } from 'react';
import api from '../../../lib/api';

function StatCard({ label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value ?? '—'}</p>
    </div>
  );
}

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/api/orders'), api.get('/api/cocktails')])
      .then(([ordersRes, cocktailsRes]) => {
        const orders = ordersRes.data;
        const cocktails = cocktailsRes.data;
        setStats({
          activeOrders: orders.filter((o) => o.status !== 'served').length,
          totalCocktails: cocktails.length,
          availableCocktails: cocktails.filter((c) => c.available).length,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
          Vue d'ensemble
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Dashboard admin</h2>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Commandes actives" value={stats?.activeOrders} />
        <StatCard label="Cocktails à la carte" value={stats?.totalCocktails} />
        <StatCard label="Cocktails disponibles" value={stats?.availableCocktails} />
      </section>
    </div>
  );
}

export default AdminDashboardPage;
