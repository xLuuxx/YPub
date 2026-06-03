import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && ['admin', 'staff'].includes(user.role)) {
    navigate('/admin', { replace: true });
    return null;
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/login', form);
      if (!['admin', 'staff'].includes(data.user.role)) {
        return setError('Accès réservé au personnel');
      }
      login(data.token, data.user);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
            Connexion
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Accès administration
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Identifiant</span>
              <input
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
                required
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
                placeholder="admin"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Mot de passe</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold transition hover:bg-violet-800 disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
