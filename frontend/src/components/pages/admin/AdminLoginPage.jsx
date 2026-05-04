import { useNavigate } from "react-router-dom";

function AdminLoginPage() {
    const navigate = useNavigate();

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

                    <form
                        className="mt-8 space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            navigate("/admin");
                        }}
                    >
                        <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Identifiant
              </span>
                            <input
                                className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
                                placeholder="admin"
                            />
                        </label>

                        <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Mot de passe
              </span>
                            <input
                                type="password"
                                className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm outline-none focus:border-violet-500"
                                placeholder="••••••••"
                            />
                        </label>

                        <button className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold transition hover:bg-violet-800">
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;