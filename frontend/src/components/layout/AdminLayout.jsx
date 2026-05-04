import { NavLink, Outlet, useLocation } from "react-router-dom";
import ypubLogo from "../../assets/ypub.webp";

function AdminLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <header className="border-b border-white/10 bg-zinc-950/95 backdrop-blur">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <a
                        href="/admin"
                        aria-label="Revenir a la page admin"
                        className="inline-flex items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                    >
                        <img
                            src={ypubLogo}
                            alt="Ypub, Revenir a la page admin"
                            className="h-15 w-auto object-contain"
                        />
                    </a>


                    <nav
                        aria-label="Navigation administration"
                        className="flex items-center gap-2 text-sm font-medium"
                    >
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                `rounded-full px-4 py-2 ${
                                    isActive && location.pathname === "/admin"
                                        ? "bg-violet-700 text-white"
                                        : "text-zinc-300 hover:bg-white/5"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/admin/orders"
                            className={({ isActive }) =>
                                `rounded-full px-4 py-2 ${
                                    isActive
                                        ? "bg-violet-700 text-white"
                                        : "text-zinc-300 hover:bg-white/5"
                                }`
                            }
                        >
                            Commandes
                        </NavLink>

                        <NavLink
                            to="/admin/cocktails"
                            className={({ isActive }) =>
                                `rounded-full px-4 py-2 ${
                                    isActive
                                        ? "bg-violet-700 text-white"
                                        : "text-zinc-300 hover:bg-white/5"
                                }`
                            }
                        >
                            Cocktails
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;