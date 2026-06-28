import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex min-h-[calc(100vh-120px)] flex-1 items-center justify-center p-6">
                <img
                    src="/under-construction.png"
                    alt="Under Construction"
                    className="h-auto w-full max-w-md rounded-2xl object-contain"
                />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
