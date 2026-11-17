import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

type BerthRate = { id: number; hourly_berth_rate: string };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Record arrival', href: '/vessel-dockings/create' },
    { title: 'Berth rates', href: '/berth-rates/create' },
];

const money = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });

export default function CreateBerthRate({ berthRates }: { berthRates: BerthRate[] }) {
    const { data, setData, post, processing, errors } = useForm({ hourly_berth_rate: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/berth-rates');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Berth rates" />
            <main className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-7">
                <header>
                    <h1 className="text-2xl font-semibold">Berth rates</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Set the hourly rate used to calculate docking fees.</p>
                </header>
                <form onSubmit={submit} className="space-y-5 rounded-lg border bg-background p-5">
                    <div className="space-y-2">
                        <label htmlFor="hourly_berth_rate" className="text-sm font-medium">Hourly rate (PHP)</label>
                        <input id="hourly_berth_rate" type="number" min="0.01" step="0.01" required autoFocus value={data.hourly_berth_rate} onChange={(event) => setData('hourly_berth_rate', event.target.value)} placeholder="Enter your port's rate" className="w-full rounded-md border bg-background px-3 py-2" />
                        {errors.hourly_berth_rate && <p className="text-sm text-red-600">{errors.hourly_berth_rate}</p>}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Link href="/vessel-dockings/create" className="rounded-md border px-4 py-2 text-sm font-medium">Back to arrival</Link>
                        <button disabled={processing} className="rounded-md bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">Save rate</button>
                    </div>
                </form>
                <section className="rounded-lg border bg-background">
                    <div className="border-b px-5 py-4">
                        <h2 className="font-semibold">Configured rates</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Rates currently available for new dockings.</p>
                    </div>
                    {berthRates.length ? (
                        <ul className="divide-y">
                            {berthRates.map((rate) => <li key={rate.id} className="flex items-center justify-between px-5 py-3 text-sm"><span>Rate {rate.id}</span><span className="font-semibold tabular-nums">{money.format(Number(rate.hourly_berth_rate))} / hour</span></li>)}
                        </ul>
                    ) : <p className="px-5 py-6 text-sm text-muted-foreground">No rates configured yet.</p>}
                </section>
            </main>
        </AppLayout>
    );
}