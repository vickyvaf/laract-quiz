export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-transparent">
                <img src="/logo.png" alt="Logo" className="size-8 object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Laract Quiz
                </span>
            </div>
        </>
    );
}
