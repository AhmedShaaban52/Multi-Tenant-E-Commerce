import { Bell, Search } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-[63px] items-center justify-between gap-4 border-b border-gray-200 bg-white px-8">
            {/* Search */}
            <label className="relative block w-full max-w-[320px]">
                <span className="sr-only">Search</span>
                <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500"
                    strokeWidth={1.75}
                />
                <input
                    type="search"
                    placeholder="Search orders, products, customers..."
                    className="h-10 w-full rounded-xl border border-gray-200 bg-[#faf9f7] pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-teal-600 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-teal-600/30"
                />
            </label>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative grid size-10 place-items-center rounded-xl text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                    <Bell className="size-5" strokeWidth={1.75} />
                    <span className="absolute right-2.5 top-2 size-2 rounded-full bg-orange-500 ring-2 ring-white" />
                </button>

                <button
                    type="button"
                    aria-label="Account menu"
                    className="grid size-10 place-items-center rounded-full bg-teal-600 text-sm font-bold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                    AR
                </button>
            </div>
        </header>
    );
}