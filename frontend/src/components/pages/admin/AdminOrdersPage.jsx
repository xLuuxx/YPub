import { useState } from "react";
import { ordersData } from "../../../data/adminData.js";

const statusOptions = ["Reçue", "En préparation", "Servie"];

function AdminOrdersPage() {
    const [orders, setOrders] = useState(ordersData);
    const [editingOrder, setEditingOrder] = useState(null);

    const updateStatus = (id, status) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id ? { ...order, status } : order
            )
        );
    };

    const removeOrder = (id) => {
        setOrders((prev) => prev.filter((order) => order.id !== id));
        if (editingOrder?.id === id) {
            setEditingOrder(null);
        }
    };

    const startEdit = (order) => {
        setEditingOrder({ ...order });
    };

    const handleEditChange = (field, value) => {
        setEditingOrder((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const saveEdit = () => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === editingOrder.id ? editingOrder : order
            )
        );
        setEditingOrder(null);
    };

    return (
        <div className="space-y-6">
            <section>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
                    Commandes
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">
                    Gestion des commandes
                </h2>
            </section>

            <section className="grid gap-4">
                {orders.map((order) => (
                    <article
                        key={order.id}
                        className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-xl font-bold text-white">{order.id}</h3>
                                    <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                    {order.status}
                  </span>
                                </div>

                                <p className="text-sm text-white">
                                    {order.table} · {order.cocktail}
                                </p>

                                <p className="text-sm text-white">Heure : {order.time}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <div>
                                    <label
                                        htmlFor={`order-status-${order.id}`}
                                        className="sr-only"
                                    >
                                        Statut de la commande {order.id}
                                    </label>
                                    <select
                                        id={`order-status-${order.id}`}
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="min-h-11 rounded-full border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none focus:border-violet-500"
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => startEdit(order)}
                                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    Modifier
                                </button>

                                <button
                                    onClick={() => removeOrder(order.id)}
                                    className="rounded-full border border-rose-400/30 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            {editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-order-title"
                        className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
                                    Édition
                                </p>
                                <h3 id="edit-order-title" className="mt-2 text-2xl font-black">
                                    Modifier la commande
                                </h3>
                            </div>

                            <button
                                onClick={() => setEditingOrder(null)}
                                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white hover:bg-white/10"
                            >
                                Fermer
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Table</span>
                                <input
                                    value={editingOrder.table}
                                    onChange={(e) => handleEditChange("table", e.target.value)}
                                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                                />
                            </label>

                            <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Cocktail
                </span>
                                <input
                                    value={editingOrder.cocktail}
                                    onChange={(e) => handleEditChange("cocktail", e.target.value)}
                                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Heure</span>
                                <input
                                    value={editingOrder.time}
                                    onChange={(e) => handleEditChange("time", e.target.value)}
                                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold">Statut</span>
                                <select
                                    value={editingOrder.status}
                                    onChange={(e) => handleEditChange("status", e.target.value)}
                                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 text-sm outline-none focus:border-violet-500"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status}>{status}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={saveEdit}
                                className="rounded-2xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
                            >
                                Enregistrer
                            </button>

                            <button
                                onClick={() => setEditingOrder(null)}
                                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrdersPage;