import {cocktailsData, ordersData} from "../../../data/adminData.js";

function StatCard({ label, value }) {
    return (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
    );
}

function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <section>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
                    Vue d’ensemble
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                    Dashboard admin
                </h2>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <StatCard label="Commandes actives" value={ordersData.length} />
                <StatCard label="Cocktails à la carte" value={cocktailsData.length} />
                <StatCard
                    label="Cocktails disponibles"
                    value={cocktailsData.filter((cocktail) => cocktail.available).length}
                />
            </section>
        </div>
    );
}

export default AdminDashboardPage;