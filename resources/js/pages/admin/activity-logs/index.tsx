import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Loader2, Shield, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ActivityLog {
    id: number;
    user_name: string | null;
    user_role: string | null;
    action: string;
    description: string;
    status: 'success' | 'error';
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

export default function Index() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadingRef = useRef(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const fetchLogs = async (pageNum: number) => {
        if (loadingRef.current) {
            return;
        }

        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/admin/api/activity-logs?page=${pageNum}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const newLogs = result.data;

            if (!newLogs || newLogs.length === 0) {
                setHasMore(false);
            } else {
                setLogs((prev) => [...prev, ...newLogs]);
                setPage(pageNum + 1);

                if (!result.next_page_url) {
                    setHasMore(false);
                }
            }
        } catch (err: any) {
            console.error('Error fetching activity logs:', err);
            setError(err.message || 'Failed to fetch logs');
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    };

    useEffect(() => {
        Promise.resolve().then(() => fetchLogs(1));
    }, []);

    // Load more when sentinel enters viewport
    useEffect(() => {
        if (!sentinelRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loadingRef.current
                ) {
                    fetchLogs(page);
                }
            },
            { threshold: 0.1 },
        );
        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [hasMore, page]);

    return (
        <>
            <Head title="Activity Log" />
            <div className="mx-auto flex h-[calc(100vh-100px)] w-full max-w-7xl flex-col space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Activity Log
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Monitor administrator and student activities, including
                        errors and operations.
                    </p>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    {error ? (
                        <div className="flex h-full items-center justify-center p-12 text-center text-red-500">
                            <AlertCircle className="mr-2 size-5" /> {error}
                        </div>
                    ) : loading && logs.length === 0 ? (
                        <div className="flex h-full items-center justify-center p-12">
                            <Loader2 className="size-8 animate-spin text-neutral-400" />
                        </div>
                    ) : logs.length > 0 ? (
                        <div className="flex-1 overflow-y-auto">
                            {logs.map((log) => {
                                const isError = log.status === 'error';
                                const formattedDate = new Date(
                                    log.created_at,
                                ).toLocaleString();

                                return (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-4 border-b border-neutral-100 p-4 transition-colors hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/20"
                                    >
                                        <div
                                            className={`mt-0.5 shrink-0 rounded-full p-2 ${
                                                isError
                                                    ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                                                    : 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400'
                                            }`}
                                        >
                                            {isError ? (
                                                <AlertCircle className="size-5" />
                                            ) : (
                                                <CheckCircle2 className="size-5" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-bold text-neutral-900 capitalize dark:text-white">
                                                    {log.action.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                                <span
                                                    className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                                                        log.user_role ===
                                                        'admin'
                                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                                            : log.user_role ===
                                                                'student'
                                                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                                                    }`}
                                                >
                                                    {log.user_role ===
                                                    'admin' ? (
                                                        <Shield className="size-3" />
                                                    ) : (
                                                        <User className="size-3" />
                                                    )}
                                                    {log.user_role || 'Guest'}
                                                </span>
                                                {log.user_name && (
                                                    <span className="text-xs font-medium text-neutral-500">
                                                        by {log.user_name}
                                                    </span>
                                                )}
                                                <span className="ml-auto shrink-0 text-[10px] text-neutral-400">
                                                    {formattedDate}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-relaxed break-words text-neutral-600 dark:text-neutral-400">
                                                {log.description}
                                            </p>

                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-400">
                                                {log.ip_address && (
                                                    <span>
                                                        IP:{' '}
                                                        <span className="font-mono">
                                                            {log.ip_address}
                                                        </span>
                                                    </span>
                                                )}
                                                {log.user_agent && (
                                                    <span
                                                        className="max-w-xs truncate md:max-w-md"
                                                        title={log.user_agent}
                                                    >
                                                        UA: {log.user_agent}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Sentinel for infinite scroll */}
                            <div
                                ref={sentinelRef}
                                className="flex items-center justify-center p-4"
                            >
                                {loading && (
                                    <Loader2 className="size-5 animate-spin text-neutral-400" />
                                )}
                                {!hasMore && logs.length > 0 && (
                                    <span className="text-xs text-neutral-400">
                                        All logs loaded
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center p-12 text-center text-neutral-500">
                            No activity logs recorded yet.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Activity Log',
            href: '/admin/activity-logs',
        },
    ],
};
