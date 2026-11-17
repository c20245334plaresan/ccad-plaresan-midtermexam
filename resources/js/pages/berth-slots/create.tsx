import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Berth slots', href: '/berth-slots' },
    { title: 'Add berth', href: '/berth-slots/create' },
];

export default function CreateBerthSlot() {
    const { data, setData, post, processing, errors } = useForm({ berth_slot: '' });
    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/berth-slots');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add berth slot" />
            <main className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-7">
                <div>
                    <h1 className="text-2xl font-semibold">Add berth slot</h1>
                    <p className="mt-1 text-sm text-muted-foreground">New berths are created as available.</p>
                </div>
                <form onSubmit={submit} className="space-y-5 rounded-lg border bg-background p-5">
                    <div className="space-y-2">
                        <label htmlFor="berth_slot" className="text-sm font-medium">Berth identifier</label>
                        <input id="berth_slot" autoFocus required maxLength={50} value={data.berth_slot} onChange={(event) => setData('berth_slot', event.target.value)} placeholder="A-01" className="w-full rounded-md border bg-background px-3 py-2" />
                        {errors.berth_slot && <p className="text-sm text-red-600">{errors.berth_slot}</p>}
                    </div>
                    <div className="flex justify-end gap-3">
                        <Link href="/berth-slots" className="rounded-md border px-4 py-2 text-sm font-medium">Cancel</Link>
                        <button disabled={processing} className="rounded-md bg-teal-800 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">Create berth</button>
                    </div>
                </form>
            </main>
        </AppLayout>
    );
}