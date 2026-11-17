import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Anchor, ArrowDownRight, ArrowUpRight, BadgeDollarSign, Clock3, Ship, ShipWheel } from 'lucide-react';
import { type ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardProps = {
    stats: {
        vessels: number;
        availableBerths: number;
        occupiedBerths: number;
        activeDockings: number;
        paidTotal: number;
        pendingPayments: number;
        arrivalsToday: number;
    };
    recentDockings: {
        id: number;
        vessel: string;
        berth: string;
        arrival: string;
        departure: string | null;
        fee: number;
    }[];
};

const currency = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
});

export default function Dashboard({ stats, recentDockings }: DashboardProps) {
    const berthTotal = stats.availableBerths + stats.occupiedBerths;
    const occupiedPercent = berthTotal ? Math.round((stats.occupiedBerths / berthTotal) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Port Operations" />

            <main className="min-h-full bg-[#f3f7f8] p-4 text-slate-900 md:p-7 dark:bg-[#07131d] dark:text-slate-100">
                <div className="mx-auto max-w-[1500px] space-y-6">
                    <header className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#102b3b] via-[#123c4b] to-[#075b5a] px-6 py-7 text-white shadow-lg shadow-slate-900/10 sm:px-8 sm:py-8">
                        <div className="absolute -top-24 -right-10 -z-10 size-72 rounded-full border border-white/10" />
                        <div className="absolute top-4 -right-1 -z-10 size-52 rounded-full border border-white/10" />
                        <div className="absolute right-28 bottom-0 -z-10 h-24 w-80 rounded-t-full bg-white/[0.04] blur-2xl" />
                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-teal-100 uppercase">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                                        <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
                                    </span>
                                    Harbor control center
                                </div>
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Port operations</h1>
                                <p className="mt-2 max-w-xl text-sm text-slate-200 sm:text-base">
                                    A clear view of vessel activity, berth capacity, and today&apos;s collections.
                                </p>
                            </div>
                            <Link
                                href="/vessel-dockings/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#123c4b] shadow-sm transition hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <Ship className="size-4" aria-hidden="true" />
                                Record arrival
                            </Link>
                        </div>
                    </header>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Port metrics">
                        <Metric
                            label="Registered vessels"
                            value={stats.vessels.toLocaleString()}
                            note={`${stats.arrivalsToday} arrivals today`}
                            icon={<Ship className="size-5" />}
                            tone="teal"
                        />
                        <Metric
                            label="Berths available"
                            value={stats.availableBerths.toLocaleString()}
                            note={`${stats.occupiedBerths} currently occupied`}
                            icon={<Anchor className="size-5" />}
                            tone="green"
                        />
                        <Metric
                            label="Active dockings"
                            value={stats.activeDockings.toLocaleString()}
                            note="Vessels alongside now"
                            icon={<ShipWheel className="size-5" />}
                            tone="blue"
                        />
                        <Metric
                            label="Payments collected"
                            value={currency.format(stats.paidTotal)}
                            note={`${stats.pendingPayments} awaiting payment`}
                            icon={<BadgeDollarSign className="size-5" />}
                            tone="amber"
                        />
                    </section>

                    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.8fr)]">
                        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-teal-600" />
                                        <h2 className="font-semibold tracking-tight">Recent vessel movements</h2>
                                    </div>
                                    <p className="mt-1.5 pl-4 text-sm text-slate-500 dark:text-slate-400">The latest docking records at your port</p>
                                </div>
                                <Link
                                    href="/vessel-dockings"
                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/60"
                                >
                                    All dockings <ArrowUpRight className="size-4" />
                                </Link>
                            </div>
                            {recentDockings.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[620px] text-left text-sm">
                                        <thead className="bg-slate-50/80 text-[11px] tracking-[0.12em] text-slate-500 uppercase dark:bg-slate-950/40 dark:text-slate-400">
                                            <tr>
                                                <th className="px-5 py-3.5 font-semibold sm:px-6">Vessel</th>
                                                <th className="px-5 py-3.5 font-semibold">Berth</th>
                                                <th className="px-5 py-3.5 font-semibold">Arrival</th>
                                                <th className="px-5 py-3.5 font-semibold">Status</th>
                                                <th className="px-5 py-3.5 text-right font-semibold sm:px-6">Fee</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {recentDockings.map((docking) => (
                                                <tr key={docking.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                                                    <td className="px-5 py-4 font-medium sm:px-6">
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                                                <Ship className="size-4" aria-hidden="true" />
                                                            </span>
                                                            <span className="max-w-[170px] truncate">{docking.vessel}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{docking.berth}</td>
                                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{docking.arrival}</td>
                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${docking.departure ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}
                                                        >
                                                            <span
                                                                className={`size-1.5 rounded-full ${docking.departure ? 'bg-slate-400' : 'bg-emerald-500'}`}
                                                            />
                                                            {docking.departure ? 'Departed' : 'Alongside'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right font-medium tabular-nums sm:px-6">
                                                        {currency.format(docking.fee)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                                    <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                        <Ship className="size-5" />
                                    </div>
                                    <h3 className="font-semibold">No docking records yet</h3>
                                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                        New arrivals will appear here as soon as a docking is recorded.
                                    </p>
                                    <Link
                                        href="/vessel-dockings/create"
                                        className="mt-4 text-sm font-semibold text-teal-800 hover:underline dark:text-teal-400"
                                    >
                                        Record the first arrival
                                    </Link>
                                </div>
                            )}
                        </div>

                        <aside className="space-y-5">
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                                <Anchor className="size-4" aria-hidden="true" />
                                            </span>
                                            <h2 className="font-semibold tracking-tight">Berth utilization</h2>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Current slot occupancy</p>
                                    </div>
                                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 tabular-nums dark:bg-teal-950 dark:text-teal-300">
                                        {occupiedPercent}% used
                                    </span>
                                </div>
                                <div className="mt-6 flex items-center gap-5">
                                    <div
                                        className="flex size-28 shrink-0 items-center justify-center rounded-full"
                                        style={{
                                            background: `conic-gradient(#0f766e ${occupiedPercent}%, #e2e8f0 ${occupiedPercent}% 100%)`,
                                        }}
                                        role="img"
                                        aria-label={`${occupiedPercent}% of berths occupied`}
                                    >
                                        <div className="flex size-[5.25rem] flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
                                            <span className="text-2xl font-semibold tabular-nums">{occupiedPercent}%</span>
                                            <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                occupied
                                            </span>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="size-2 rounded-full bg-teal-700" />
                                                Occupied
                                            </span>
                                            <span className="font-semibold tabular-nums">{stats.occupiedBerths}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="size-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                Available
                                            </span>
                                            <span className="font-semibold tabular-nums">{stats.availableBerths}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href="/berth-slots"
                                    className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-800 dark:hover:bg-teal-950/60 dark:hover:text-teal-200"
                                >
                                    Manage berths <ArrowUpRight className="size-4" />
                                </Link>
                            </section>

                            <section className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm sm:p-6 dark:border-amber-900/50 dark:from-amber-950/40 dark:to-slate-900">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                                        <Clock3 className="size-4" />
                                    </span>
                                    <div>
                                        <h2 className="font-semibold tracking-tight">Attention</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Items needing follow-up</p>
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center justify-between gap-4 border-t border-amber-200/70 pt-4 dark:border-amber-900/50">
                                    <div>
                                        <p className="text-sm font-semibold">Payments to review</p>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Pending or unpaid invoices</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-semibold tabular-nums">{stats.pendingPayments}</span>
                                        {stats.pendingPayments > 0 ? (
                                            <ArrowUpRight className="size-4 text-amber-600" aria-hidden="true" />
                                        ) : (
                                            <ArrowDownRight className="size-4 text-teal-700" aria-hidden="true" />
                                        )}
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}

function Metric({
    label,
    value,
    note,
    icon,
    tone,
}: {
    label: string;
    value: string;
    note: string;
    icon: ReactNode;
    tone: 'teal' | 'green' | 'blue' | 'amber';
}) {
    const tones = {
        teal: 'bg-teal-50 text-teal-800 ring-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:ring-teal-900',
        green: 'bg-emerald-50 text-emerald-800 ring-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900',
        blue: 'bg-sky-50 text-sky-800 ring-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-900',
        amber: 'bg-amber-50 text-amber-800 ring-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900',
    };

    return (
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-3 truncate text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{note}</p>
                </div>
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${tones[tone]}`}>{icon}</div>
            </div>
        </article>
    );
}
