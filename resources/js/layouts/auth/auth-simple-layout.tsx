import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div
            className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-6 md:p-10 overflow-hidden"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            {/* Animated Clouds */}
            <div className="absolute top-[20%] left-[10%] w-40 md:w-64 z-0 pointer-events-none select-none hidden lg:block animate-slide-left">
                <img src="/cloud_1.png" alt="Cloud" className="w-full h-auto animate-float-slow" />
            </div>
            <div className="absolute top-[10%] right-[5%] w-36 md:w-56 z-0 pointer-events-none select-none hidden lg:block animate-slide-right">
                <img src="/cloud_1.png" alt="Cloud" className="w-full h-auto animate-float-slower" />
            </div>
            <div className="absolute bottom-[12%] left-[8%] w-44 md:w-72 z-0 pointer-events-none select-none hidden lg:block animate-slide-left">
                <img src="/cloud_1.png" alt="Cloud" className="w-full h-auto animate-float-slower" />
            </div>
            <div className="absolute bottom-[28%] right-[8%] w-40 md:w-64 z-0 pointer-events-none select-none hidden lg:block animate-slide-right">
                <img src="/cloud_1.png" alt="Cloud" className="w-full h-auto animate-float-slow" />
            </div>

            <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-950/80">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-20 w-20 items-center justify-center rounded-md">
                                <img src="/logo.png" alt="Logo" className="size-20 object-contain" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
