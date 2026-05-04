import ypubLogo from "../../assets/ypub.webp";

function Header() {
    return (
        <header
            id="top"
            className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur"
        >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <a
                    href="#top"
                    aria-label="Revenir en haut de la page"
                    className="inline-flex items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                >
                    <img
                        src={ypubLogo}
                        alt="Ypub, retour en haut de la page"
                        className="h-15 w-auto object-contain"
                    />
                </a>

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
                                Commande
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;