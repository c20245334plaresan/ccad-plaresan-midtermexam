import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

type BerthSlot = {
    id: number;
    berth_slot: string;
    status: 'Available' | 'Occupied';
    vessel_dockings_count?: number;
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Berth slots', href: '/berth-slots' },
];

export default function BerthSlotsIndex({ berthSlots }: { berthSlots: Paginator<BerthSlot> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Berth slots" />
            <main className="space-y-6 p-4 md:p-7">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Berth slots</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Manage berths and review current occupancy.</p>
                    </div>
                    <Link href="/berth-slots/create" className="rounded-md bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">Add berth</Link>
                </header>
                <section className="overflow-x-auto rounded-lg border bg-background">
                    <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                            <tr><th className="px-4 py-3">Berth</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Docking records</th><th className="px-4 py-3">Rename</th></tr>
                        </thead>
                        <tbody className="divide-y">
                            {berthSlots.data.map((slot) => <BerthSlotRow key={slot.id} slot={slot} />)}
                        </tbody>
                    </table>
                    {!berthSlots.data.length && <p className="p-8 text-center text-sm text-muted-foreground">No berth slots have been added.</p>}
                </section>
                <Pagination paginator={berthSlots} />
            </main>
        </AppLayout>
    );
}

function BerthSlotRow({ slot }: { slot: BerthSlot }) {
    const { data, setData, patch, processing, errors } = useForm({ berth_slot: slot.berth_slot });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        patch(`/berth-slots/${slot.id}`);
    };

    return (
        <tr>
            <td className="px-4 py-3 font-medium">{slot.berth_slot}</td>
            <td className="px-4 py-3"><span className={slot.status === 'Available' ? 'text-emerald-700' : 'text-amber-700'}>{slot.status}</span></td>
            <td className="px-4 py-3">{slot.vessel_dockings_count ?? 0}</td>
            <td className="px-4 py-3">
                <form onSubmit={submit} className="flex items-start gap-2">
                    <div>
                        <input aria-label={`Rename ${slot.berth_slot}`} value={data.berth_slot} onChange={(event) => setData('berth_slot', event.target.value)} className="w-32 rounded-md border bg-background px-2 py-1.5" />
                        {errors.berth_slot && <p className="mt-1 text-xs text-red-600">{errors.berth_slot}</p>}
                    </div>
                    <button disabled={processing} className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50">Save</button>
                </form>
            </td>
        </tr>
    );
}

function Pagination<T>({ paginator }: { paginator: Paginator<T> }) {
    return (
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Pagination">
            <span className="text-muted-foreground">Page {paginator.current_page} of {paginator.last_page}</span>
            <div className="flex gap-1">
                {paginator.links.map((link, index) => (
                    link.url ? <Link key={index} href={link.url} preserveScroll className={`rounded border px-3 py-1.5 ${link.active ? 'bg-teal-800 text-white' : 'hover:bg-muted'}`}>{link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}</Link> : <span key={index} className="rounded border px-3 py-1.5 text-muted-foreground">{link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}</span>
                ))}
            </div>
        </nav>
    );
}