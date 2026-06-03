import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(location.state?.from || '/', { replace: true });
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
      login(data.token, data.user);

      if (['admin', 'staff'].includes(data.user.role)) {
        navigate('/admin', { replace: true });
      } else {
        navigate(location.state?.from || '/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-700">
            Bienvenue
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Connexion</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Identifiant</span>
              <input
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
                required
                className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                placeholder="monidentifiant"
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
                className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-white px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                placeholder="••••••••••••"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-violet-700 hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
