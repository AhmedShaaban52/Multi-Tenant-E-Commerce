"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    DollarSign,
    Megaphone,
    Search,
    Settings,
    Store,
    type LucideIcon,
} from "lucide-react";

type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
};

const mainNav: NavItem[] = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Orders", href: "/orders", icon: ShoppingBag, badge: 12 },
    { label: "Products", href: "/products", icon: Package },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Payments", href: "/payments", icon: DollarSign },
];

const storeNav: NavItem[] = [
    { label: "Marketing", href: "/marketing", icon: Megaphone },
    { label: "Analytics", href: "/analytics", icon: Search },
    { label: "Settings", href: "/settings", icon: Settings },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
                active
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            ].join(" ")}
        >
            <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-black">{item.label}</span>
            {item.badge ? (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold leading-none text-white">
                    {item.badge}
                </span>
            ) : null}
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 pt-6">
                <div className="grid size-9 place-items-center rounded-xl bg-teal-600 text-white">
                    <Store className="size-5" strokeWidth={1.75} />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">
                    Marketly
                </span>
            </div>

            {/* Store switcher */}
            <div className="px-5 pt-5">
                <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                    <span className="grid size-8 place-items-center rounded-lg bg-teal-50 text-sm font-bold text-teal-700">
                        W
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-gray-900">
                            Willow &amp; Oak
                        </span>
                        <span className="block truncate text-xs text-gray-500">
                            willowoak.marketly.app
                        </span>
                    </span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-5 pt-5">
                <ul className="space-y-1">
                    {mainNav.map((item) => (
                        <li key={item.href}>
                            <NavLink item={item} active={isActive(item.href)} />
                        </li>
                    ))}
                </ul>

                <p className="mb-2 mt-6 px-3 text-xs font-semibold text-gray-500">
                    Store
                </p>
                <ul className="space-y-1">
                    {storeNav.map((item) => (
                        <li key={item.href}>
                            <NavLink item={item} active={isActive(item.href)} />
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Plan usage */}
            <div className="p-5">
                <div className="rounded-2xl bg-teal-50 p-4">
                    <p className="text-sm font-semibold text-gray-900">Growth plan</p>
                    <p className="mt-0.5 text-xs text-gray-600">
                        1,440 of 2,000 orders used
                    </p>
                    <div
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={2000}
                        aria-valuenow={1440}
                        className="mt-3 h-1.5 overflow-hidden rounded-full bg-white"
                    >
                        <div className="h-full w-[72%] rounded-full bg-teal-600" />
                    </div>
                    <button
                        type="button"
                        className="mt-4 w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                    >
                        Upgrade
                    </button>
                </div>
            </div>
        </aside>
    );
}