import { Link } from 'react-router-dom';
import ypubLogo from '../../assets/ypub.webp';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-zinc-100 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Retour à l'accueil"
          className="inline-flex items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <img
            src={ypubLogo}
            alt="Y'Pub"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-1 text-sm font-medium text-zinc-600">
            <li>
              <a href="#carte" className="rounded-lg px-3 py-2 transition hover:text-zinc-950">
                Carte
              </a>
            </li>
            <li>
              <a href="#commande" className="rounded-lg px-3 py-2 transition hover:text-zinc-950">
                Commander
              </a>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="rounded-lg px-3 py-2 transition hover:text-zinc-950"
                  >
                    {user.identifier}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="rounded-lg px-3 py-2 text-zinc-400 transition hover:text-rose-500"
                  >
                    Quitter
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="rounded-lg px-3 py-2 transition hover:text-zinc-950"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="rounded-lg bg-zinc-950 px-4 py-2 text-white transition hover:bg-violet-700"
                  >
                    S'inscrire
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
