import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

type Docking = {
    id: number;
    arrival_time: string;
    departure_time: string | null;
    total_hours: string;
    total_berth_fee: string;
    estimated_total_hours?: number;
    estimated_total_berth_fee?: number;
    vessel: { vessel_name: string; vessel_imo_number: string; vessel_gt: number };
    berth_slot: { berth_slot: string };
    berth_rate: { hourly_berth_rate: string };
    payment?: { payment_status: string } | null;
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vessel dockings', href: '/vessel-dockings' },
];

const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

export default function VesselDockingsIndex({ dockings }: { dockings: Paginator<Docking> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vessel dockings" />
            <main className="space-y-6 p-4 md:p-7">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Vessel dockings</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Arrival, departure, fee, and payment records.</p>
                    </div>
                    <Link
                        href="/vessel-dockings/create"
                        className="rounded-md bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                        Record arrival
                    </Link>
                </header>
                <section className="bg-background overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">Vessel</th>
                                <th className="px-4 py-3">Berth</th>
                                <th className="px-4 py-3">Arrival</th>
                                <th className="px-4 py-3">Departure / status</th>
                                <th className="px-4 py-3">Hours</th>
                                <th className="px-4 py-3 text-right">Fee</th>
                                <th className="px-4 py-3">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {dockings.data.map((docking) => (
                                <DockingRow key={docking.id} docking={docking} />
                            ))}
                        </tbody>
                    </table>
                    {!dockings.data.length && <p className="text-muted-foreground p-8 text-center text-sm">No docking records yet.</p>}
                </section>
                <Pagination paginator={dockings} />
            </main>
        </AppLayout>
    );
}

function DockingRow({ docking }: { docking: Docking }) {
    const { data, setData, patch, processing, errors } = useForm({ departure_time: localDateTimeValue() });
    const displayedHours = docking.departure_time ? docking.total_hours : (docking.estimated_total_hours ?? docking.total_hours);
    const displayedFee = docking.departure_time ? docking.total_berth_fee : (docking.estimated_total_berth_fee ?? docking.total_berth_fee);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        patch(`/vessel-dockings/${docking.id}`);
    };

    return (
        <tr>
            <td className="px-4 py-3">
                <p className="font-medium">{docking.vessel.vessel_name}</p>
                <p className="text-muted-foreground text-xs">IMO {docking.vessel.vessel_imo_number}</p>
            </td>
            <td className="px-4 py-3">{docking.berth_slot.berth_slot}</td>
            <td className="px-4 py-3">{new Date(docking.arrival_time).toLocaleString()}</td>
            <td className="px-4 py-3">
                {docking.departure_time ? (
                    new Date(docking.departure_time).toLocaleString()
                ) : (
                    <form onSubmit={submit} className="flex items-start gap-2">
                        <div>
                            <input
                                aria-label={`Departure time for ${docking.vessel.vessel_name}`}
                                required
                                type="datetime-local"
                                value={data.departure_time}
                                onChange={(event) => setData('departure_time', event.target.value)}
                                className="bg-background rounded-md border px-2 py-1.5"
                            />
                            {errors.departure_time && <p className="mt-1 text-xs text-red-600">{errors.departure_time}</p>}
                        </div>
                        <button
                            disabled={processing}
                            className="hover:bg-muted rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                        >
                            Depart
                        </button>
                    </form>
                )}
            </td>
            <td className="px-4 py-3 tabular-nums">
                {Number(displayedHours).toFixed(2)}
                {!docking.departure_time && <span className="text-muted-foreground ml-1 text-xs">Est.</span>}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
                {money.format(Number(displayedFee))}
                {!docking.departure_time && <span className="text-muted-foreground ml-1 text-xs">Est.</span>}
            </td>
            <td className="px-4 py-3">{docking.payment?.payment_status ?? 'Pending'}</td>
        </tr>
    );
}

function Pagination<T>({ paginator }: { paginator: Paginator<T> }) {
    return (
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Pagination">
            <span className="text-muted-foreground">
                Page {paginator.current_page} of {paginator.last_page}
            </span>
            <div className="flex gap-1">
                {paginator.links.map((link, index) =>
                    link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            className={`rounded border px-3 py-1.5 ${link.active ? 'bg-teal-800 text-white' : 'hover:bg-muted'}`}
                        >
                            {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                        </Link>
                    ) : (
                        <span key={index} className="text-muted-foreground rounded border px-3 py-1.5">
                            {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                        </span>
                    ),
                )}
            </div>
        </nav>
    );
}

function localDateTimeValue(): string {
    const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
}
