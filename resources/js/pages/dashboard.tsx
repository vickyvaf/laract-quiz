import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-120px)] p-6">
                <img 
                    src="/under-construction.png" 
                    alt="Under Construction" 
                    className="max-w-md w-full h-auto object-contain rounded-2xl"
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
