"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";
import Avatar from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { isCollapsed, toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={toggle}
          className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:flex"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex-1" />

      {/* Profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none">
            <Avatar
              name={user ? `${user.first_name} ${user.last_name}` : ""}
              size="sm"
            />
            <span className="hidden font-medium text-gray-700 md:block">
              {user?.first_name} {user?.last_name}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs font-normal text-gray-500">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
