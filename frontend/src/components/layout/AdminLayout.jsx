import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ypubLogo from '../../assets/ypub.webp';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Commandes' },
  { to: '/admin/cocktails', label: 'Cocktails' },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink
            to="/admin"
            aria-label="Dashboard"
            className="inline-flex items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <img src={ypubLogo} alt="Y'Pub" className="h-12 w-auto object-contain" />
          </NavLink>

          <div className="flex items-center gap-2">
            <nav aria-label="Navigation administration" className="flex items-center gap-1 text-sm font-medium">
              {NAV.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition ${
                      isActive ? 'bg-violet-700 text-white' : 'text-zinc-300 hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 transition ${
                      isActive ? 'bg-violet-700 text-white' : 'text-zinc-300 hover:bg-white/5'
                    }`
                  }
                >
                  Utilisateurs
                </NavLink>
              )}
            </nav>

            <button
              onClick={handleLogout}
              className="ml-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-rose-400/30 hover:text-rose-300"
            >
              Quitter
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
