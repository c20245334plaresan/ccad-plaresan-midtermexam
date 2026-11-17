import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent, type ReactNode } from 'react';

type BerthSlot = { id: number; berth_slot: string };
type BerthRate = { id: number; hourly_berth_rate: string };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vessel dockings', href: '/vessel-dockings' },
    { title: 'Record arrival', href: '/vessel-dockings/create' },
];

export default function CreateVesselDocking({ berthSlots, berthRates }: { berthSlots: BerthSlot[]; berthRates: BerthRate[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vessel_imo_number: '',
        vessel_name: '',
        flag_country: '',
        vessel_gt: '',
        berth_slot_id: '',
        berth_rate_id: '',
        arrival_time: localDateTimeValue(),
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/vessel-dockings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record vessel arrival" />
            <main className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-7">
                <div>
                    <h1 className="text-2xl font-semibold">Record vessel arrival</h1>
                    <p className="mt-1 text-sm text-muted-foreground">A new docking will occupy its berth until departure is recorded.</p>
                </div>
                <form onSubmit={submit} className="grid gap-5 rounded-lg border bg-background p-5 sm:grid-cols-2">
                    <Field label="Vessel IMO number" error={errors.vessel_imo_number}>
                        <input required maxLength={7} inputMode="numeric" value={data.vessel_imo_number} onChange={(event) => setData('vessel_imo_number', event.target.value)} placeholder="1234567" className="w-full rounded-md border bg-background px-3 py-2" />
                    </Field>
                    <Field label="Vessel name" error={errors.vessel_name}>
                        <input required value={data.vessel_name} onChange={(event) => setData('vessel_name', event.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
                    </Field>
                    <Field label="Flag country" error={errors.flag_country}>
                        <input required value={data.flag_country} onChange={(event) => setData('flag_country', event.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
                    </Field>
                    <Field label="Gross tonnage" error={errors.vessel_gt}>
                        <input required min={1} type="number" value={data.vessel_gt} onChange={(event) => setData('vessel_gt', event.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
                    </Field>
                    <Field label="Available berth" error={errors.berth_slot_id}>
                        <select required value={data.berth_slot_id} onChange={(event) => setData('berth_slot_id', event.target.value)} className="w-full rounded-md border bg-background px-3 py-2">
                            <option value="">Select a berth</option>
                            {berthSlots.map((slot) => <option key={slot.id} value={slot.id}>{slot.berth_slot}</option>)}
                        </select>
                        {!berthSlots.length && <Link href="/berth-slots/create" className="mt-1 inline-block text-xs font-semibold text-teal-800 underline dark:text-teal-400">Add a berth slot</Link>}
                    </Field>
                    <Field label="Hourly berth rate" error={errors.berth_rate_id}>
                        <select required value={data.berth_rate_id} onChange={(event) => setData('berth_rate_id', event.target.value)} className="w-full rounded-md border bg-background px-3 py-2">
                            <option value="">Select a rate</option>
                            {berthRates.map((rate) => <option key={rate.id} value={rate.id}>PHP {Number(rate.hourly_berth_rate).toLocaleString()} / hour</option>)}
                        </select>
                        {!berthRates.length && <Link href="/berth-rates/create" className="mt-1 inline-block text-xs font-semibold text-teal-800 underline dark:text-teal-400">Configure an hourly rate</Link>}
                    </Field>
                    <Field label="Arrival time" error={errors.arrival_time}>
                        <input required type="datetime-local" value={data.arrival_time} onChange={(event) => setData('arrival_time', event.target.value)} className="w-full rounded-md border bg-background px-3 py-2" />
                    </Field>
                    <div className="flex items-end justify-end gap-3 sm:col-span-2">
                        <Link href="/vessel-dockings" className="rounded-md border px-4 py-2 text-sm font-medium">Cancel</Link>
                        <button disabled={processing || !berthSlots.length || !berthRates.length} className="rounded-md bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">Record arrival</button>
                    </div>
                </form>
            </main>
        </AppLayout>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

function localDateTimeValue(): string {
    const local = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
}