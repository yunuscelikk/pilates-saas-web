"use client";

import Link from "next/link";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  UserPlus,
  UserCog,
  CalendarPlus,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    name: "Yeni Üye Ekle",
    href: "/members/create",
    icon: UserPlus,
    color: "bg-brand-light text-brand",
  },
  {
    name: "Yeni Eğitmen Ekle",
    href: "/trainers/create",
    icon: UserCog,
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "Yeni Sınıf Ekle",
    href: "/classes/create",
    icon: CalendarPlus,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Yeni Rezervasyon",
    href: "/bookings/create",
    icon: BookOpen,
    color: "bg-amber-50 text-amber-600",
  },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hızlı İşlemler</CardTitle>
        <CardDescription>Sık kullanılan işlemler</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {actions.map((action) => (
            <Link key={action.name} href={action.href}>
              <div className="group flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-all hover:border-gray-200 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}
                  >
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.name}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
