import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

const ROLES = ['user', 'staff', 'admin'];
const ROLE_LABELS = { user: 'Client', staff: 'Staff', admin: 'Admin' };
const ROLE_COLORS = {
  user: 'bg-zinc-700 text-zinc-300',
  staff: 'bg-violet-500/20 text-violet-300',
  admin: 'bg-amber-500/20 text-amber-300',
};

const EMPTY_FORM = { identifier: '', password: '', role: 'user' };

function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/users')
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function createUser(e) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/users', form);
      setUsers((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  }

  async function updateRole(id, role) {
    try {
      const { data } = await api.patch(`/api/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: data.role } : u)));
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  }

  async function deleteUser(id) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  }

  if (loading) return <p className="text-zinc-400">Chargement…</p>;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
          Utilisateurs
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Gestion des comptes</h2>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <form
          onSubmit={createUser}
          className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6"
        >
          <h3 className="text-xl font-bold">Créer un compte</h3>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Identifiant
            </span>
            <input
              value={form.identifier}
              onChange={(e) => setForm((p) => ({ ...p, identifier: e.target.value }))}
              required
              placeholder="8 à 12 caractères alphanumériques"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Mot de passe
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
              placeholder="12+ car. — 1 maj, 1 chiffre, 1 spécial"
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Rôle
            </span>
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </label>

          {formError && (
            <p className="text-sm text-rose-400">{formError}</p>
          )}

          <button
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold hover:bg-violet-600 disabled:opacity-50"
          >
            {submitting ? 'Création…' : 'Créer'}
          </button>
        </form>

        <div className="space-y-3">
          {users.length === 0 && <p className="text-zinc-400">Aucun utilisateur.</p>}
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold">{u.identifier}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                  {ROLE_LABELS[u.role]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                  disabled={u.id === currentUser.id}
                  className="rounded-full border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500 disabled:opacity-40"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>

                <button
                  onClick={() => deleteUser(u.id)}
                  disabled={u.id === currentUser.id}
                  className="rounded-full border border-rose-400/30 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-30"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
