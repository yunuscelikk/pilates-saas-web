"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Card, { CardContent } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  Users,
  CreditCard,
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function StatCard({ name, value, description, icon: Icon, href, iconBg }) {
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <motion.div variants={item}>
      <Wrapper {...wrapperProps}>
        <Card className="group transition-all hover:shadow-md hover:border-gray-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{name}</p>
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} transition-transform group-hover:scale-110`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold tracking-tight text-gray-900">
                {value}
              </p>
              {description && (
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    </motion.div>
  );
}

export default function DashboardStatsCards({ summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const stats = [
    {
      name: "Toplam Üye",
      value: summary?.totalMembers ?? "—",
      description: `${summary?.activeMembers ?? 0} aktif üye`,
      icon: Users,
      iconBg: "bg-brand-light text-brand",
      href: "/members",
    },
    {
      name: "Aktif Üyelikler",
      value: summary?.activeMemberships ?? "—",
      description: summary?.expiringMemberships
        ? `${summary.expiringMemberships} bu hafta sona eriyor`
        : "Tüm üyelikler güncel",
      icon: CreditCard,
      iconBg: "bg-emerald-100 text-emerald-600",
      href: "/memberships",
    },
    {
      name: "Bugünkü Seanslar",
      value: summary?.todaySessions ?? "—",
      description: `${summary?.totalBookings ?? 0} toplam rezervasyon`,
      icon: CalendarDays,
      iconBg: "bg-violet-100 text-violet-600",
      href: "/classes",
    },
    {
      name: "Aylık Gelir",
      value:
        summary?.monthlyRevenue !== undefined
          ? `${summary.monthlyRevenue.toLocaleString("tr-TR")} ₺`
          : "—",
      description: "Bu ay toplam gelir",
      icon: DollarSign,
      iconBg: "bg-amber-100 text-amber-600",
      href: "/payments",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <StatCard key={stat.name} {...stat} />
      ))}
    </motion.div>
  );
}
