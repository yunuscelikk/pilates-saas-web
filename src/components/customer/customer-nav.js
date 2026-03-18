"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomerNav({ studioSlug }) {
  const pathname = usePathname();
  const base = `/book/${studioSlug}`;

  const tabs = [
    { href: base, label: "Ana Sayfa", icon: Home, exact: true },
    { href: `${base}/schedule`, label: "Takvim", icon: CalendarDays },
    { href: `${base}/profile`, label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-10 w-full max-w-lg -translate-x-1/2 border-t border-gray-200 bg-white">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
                isActive
                  ? "text-primary-600 font-medium"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "text-primary-600")} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
