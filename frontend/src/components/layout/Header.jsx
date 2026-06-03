import { Link } from 'react-router-dom';
import ypubLogo from '../../assets/ypub.webp';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="Revenir en haut de la page"
          className="inline-flex items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        >
          <img
            src={ypubLogo}
            alt="Y'Pub, retour à l'accueil"
            className="h-15 w-auto object-contain"
          />
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <li>
              <a
                href="#carte"
                className="rounded-full px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
              >
                Carte
              </a>
            </li>
            <li>
              <a
                href="#commande"
                className="rounded-full px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
              >
                Commander
              </a>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="rounded-full px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    Mon compte
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="rounded-full border border-zinc-200 px-3 py-2 transition hover:border-rose-200 hover:text-rose-600"
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="rounded-full px-3 py-2 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="rounded-full bg-violet-700 px-4 py-2 text-white transition hover:bg-violet-800"
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
