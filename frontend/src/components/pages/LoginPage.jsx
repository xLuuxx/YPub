import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import ypubLogo from '../../assets/ypub.webp';

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
    <div className="min-h-screen bg-zinc-950 text-white lg:grid lg:grid-cols-2">

      <div className="relative hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-white/5 lg:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(124,58,237,0.18),transparent_65%)]" />

        <Link to="/" className="relative z-10">
          <img src={ypubLogo} alt="Y'Pub" className="h-12 w-auto object-contain" />
        </Link>

        <div className="relative z-10">
          <p className="text-6xl font-black leading-none tracking-tighter text-white">
            Y'Pub
          </p>
          <p className="mt-4 max-w-xs text-lg leading-relaxed text-zinc-400">
            Cocktails, commandes, et bonne ambiance — tout depuis votre table.
          </p>
        </div>

        <p className="relative z-10 text-xs text-zinc-600">Y'Pub &copy; 2025</p>
      </div>

      <div className="flex min-h-screen items-center justify-center px-6 py-16 lg:min-h-0 lg:px-14">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 block lg:hidden">
            <img src={ypubLogo} alt="Y'Pub" className="h-10 w-auto object-contain" />
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
            Connexion
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Bon retour.
          </h1>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Identifiant
              </span>
              <input
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
                required
                className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-violet-500 focus:bg-white/8"
                placeholder="monidentifiant"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Mot de passe
              </span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-violet-500"
                placeholder="••••••••••••"
              />
            </label>

            {error && (
              <p role="alert" className="text-sm text-rose-400">{error}</p>
            )}

            <button
              disabled={loading}
              className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-8 text-sm text-zinc-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
