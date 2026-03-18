"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import { hasPermission } from "@/lib/permissions";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarDays,
  CalendarRange,
  BookOpen,
  CreditCard,
  ClipboardList,
  DollarSign,
  Bell,
  UserCog,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Crown,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Üyeler", href: "/members", icon: Users },
  { name: "Eğitmenler", href: "/trainers", icon: Dumbbell },
  { name: "Sınıflar", href: "/classes", icon: CalendarDays },
  { name: "Takvim", href: "/calendar", icon: CalendarRange },
  { name: "Rezervasyonlar", href: "/bookings", icon: BookOpen },
  { name: "Üyelikler", href: "/memberships", icon: CreditCard },
  { name: "Üyelik Planları", href: "/membership-plans", icon: ClipboardList },
  { name: "Ödemeler", href: "/payments", icon: DollarSign },
  { name: "Bildirimler", href: "/notifications", icon: Bell },
  { name: "Personel", href: "/staff", icon: UserCog },
  { name: "Abonelik", href: "/subscription", icon: Crown },
  { name: "Ayarlar", href: "/settings", icon: Settings },
];

function NavItem({ item, isActive, isCollapsed, onNavigate }) {
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center rounded-lg text-sm font-medium transition-colors",
        isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
        isActive
          ? "bg-sidebar-active text-white"
          : "text-gray-300 hover:bg-sidebar-hover hover:text-white",
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function SidebarContent({
  onNavigate,
  isCollapsed = false,
  showToggle = false,
  onToggle,
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavigation = navigation.filter((item) =>
    hasPermission(user?.role, item.href),
  );

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center",
          isCollapsed ? "justify-center px-2" : "px-6",
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          onClick={onNavigate}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-white">Pilates Studio</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className={cn("flex-1 space-y-1 py-4", isCollapsed ? "px-2" : "px-3")}
      >
        {filteredNavigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavItem
              key={item.name}
              item={item}
              isActive={isActive}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          );
        })}
      </nav>

      {/* Footer with collapse toggle */}
      <div className="border-t border-gray-700">
        {showToggle && (
          <button
            onClick={onToggle}
            className={cn(
              "flex w-full items-center text-gray-400 transition-colors hover:bg-sidebar-hover hover:text-white",
              isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-6 py-3",
            )}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                <span className="text-xs">Daralt</span>
              </>
            )}
          </button>
        )}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500">© 2026 Pilates Studio</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <>
      {/* Desktop sidebar — collapsible */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden transition-all duration-300 lg:block",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          showToggle
          onToggle={toggle}
        />
      </aside>

      {/* Mobile sidebar — Sheet drawer */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onNavigate={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
