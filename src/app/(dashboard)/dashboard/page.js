"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats, useAdvancedStats } from "@/hooks/useDashboard";
import { usePlanUsage } from "@/hooks/useSubscription";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/skeleton";
import Skeleton from "@/components/ui/skeleton";
import Badge from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header";
import Link from "next/link";
import {
  Users,
  CreditCard,
  CalendarDays,
  DollarSign,
  BookOpen,
  AlertTriangle,
  UserPlus,
  CalendarPlus,
  UserCog,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Crown,
  Lock,
  Gauge,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const quickActions = [
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

const PIE_COLORS = ["#22c55e", "#ef4444"];

const STATUS_LABELS = {
  active: "Aktif",
  passive: "Pasif",
};

const ADVANCED_COLORS = [
  "#6260e1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#64748b",
];

function UsageBar({ label, current, limit, icon: Icon, color }) {
  const isUnlimited = limit === null || limit === undefined;
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && current >= limit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span
          className={`text-sm font-semibold ${isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-gray-900"}`}
        >
          {current} / {isUnlimited ? "∞" : limit}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div
            className={`h-2 rounded-full transition-all ${isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-brand"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      {isUnlimited && (
        <div className="h-2 w-full rounded-full bg-emerald-100">
          <div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ name, value, icon: Icon, trend, trendLabel, href, color }) {
  return (
    <Link href={href}>
      <Card className="group transition-all hover:shadow-md hover:border-gray-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{name}</p>
              <p className="text-2xl font-bold tracking-tight text-gray-900">
                {value}
              </p>
              {trend !== undefined && (
                <div className="flex items-center gap-1">
                  {trend >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {trend >= 0 ? "+" : ""}
                    {trend}%
                  </span>
                  {trendLabel && (
                    <span className="text-xs text-gray-400">{trendLabel}</span>
                  )}
                </div>
              )}
            </div>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color} transition-transform group-hover:scale-110`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboardStats();
  const { data: usageData } = usePlanUsage();
  const hasAdvancedReports = usageData?.data?.features?.advanced_reports;
  const { data: advancedData } = useAdvancedStats(!!hasAdvancedReports);

  const summary = dashboardData?.data?.summary;
  const charts = dashboardData?.data?.charts;
  const usage = usageData?.data;
  const advanced = advancedData?.data;

  const stats = [
    {
      name: "Toplam Üye",
      value: summary?.totalMembers ?? "—",
      icon: Users,
      color: "bg-brand-light text-brand",
      href: "/members",
    },
    {
      name: "Aktif Üyelikler",
      value: summary?.activeMemberships ?? "—",
      icon: CreditCard,
      color: "bg-emerald-100 text-emerald-600",
      href: "/memberships",
    },
    {
      name: "Bugünkü Seanslar",
      value: summary?.todaySessions ?? "—",
      icon: CalendarDays,
      color: "bg-violet-100 text-violet-600",
      href: "/classes",
    },
    {
      name: "Aylık Gelir",
      value:
        summary?.monthlyRevenue !== undefined
          ? `${summary.monthlyRevenue.toLocaleString("tr-TR")} ₺`
          : "—",
      icon: DollarSign,
      color: "bg-amber-100 text-amber-600",
      href: "/payments",
    },
  ];

  const secondaryStats = [
    {
      name: "Toplam Rezervasyon",
      value: summary?.totalBookings ?? "—",
      icon: BookOpen,
      color: "bg-indigo-100 text-indigo-600",
      href: "/bookings",
    },
    {
      name: "Süresi Dolacak Üyelikler",
      value: summary?.expiringMemberships ?? "—",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      href: "/memberships",
    },
  ];

  const dailyBookings = charts?.dailyBookings || [];
  const monthlyRevenue = charts?.monthlyRevenue || [];
  const membershipDist = (charts?.membershipDistribution || []).map((d) => ({
    ...d,
    name: STATUS_LABELS[d.status] || d.status,
  }));

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <PageHeader
        title={`Hoş geldin, ${user?.first_name}! 👋`}
        description="İşte stüdyonuzun güncel durumu."
      />

      {/* Main Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.name} {...stat} />
          ))}
        </div>
      )}

      {/* Secondary stats row */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {secondaryStats.map((stat) => (
            <StatCard key={stat.name} {...stat} />
          ))}
        </div>
      )}

      {/* Subscription Status Card */}
      {user?.Studio?.Subscription && (
        <Link href="/subscription">
          <Card className="transition-all hover:shadow-md hover:border-gray-300">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Abonelik</p>
                  <p className="font-semibold text-gray-900">
                    {user.Studio.Subscription.Plan?.name || "—"} Plan
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  user.Studio.Subscription.status === "active"
                    ? "success"
                    : user.Studio.Subscription.status === "trialing"
                      ? "info"
                      : "warning"
                }
              >
                {user.Studio.Subscription.status === "active"
                  ? "Aktif"
                  : user.Studio.Subscription.status === "trialing"
                    ? "Deneme"
                    : user.Studio.Subscription.status === "past_due"
                      ? "Ödeme Gecikmiş"
                      : user.Studio.Subscription.status === "canceled"
                        ? "İptal"
                        : "Süresi Doldu"}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Plan Usage */}
      {usage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-brand" />
                <CardTitle>Plan Kullanımı</CardTitle>
              </div>
              <Badge variant="info">{usage.plan?.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <UsageBar
                label="Üyeler"
                current={usage.usage.members}
                limit={usage.limits.max_members}
                icon={Users}
                color="text-brand"
              />
              <UsageBar
                label="Sınıflar"
                current={usage.usage.classes}
                limit={usage.limits.max_classes}
                icon={CalendarDays}
                color="text-violet-600"
              />
              <UsageBar
                label="Personel"
                current={usage.usage.staff}
                limit={usage.limits.max_staff}
                icon={UserCog}
                color="text-amber-600"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="mb-4 h-5 w-48" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Bookings Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Son 7 Gün — Rezervasyonlar</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyBookings} barCategoryGap="20%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                        })
                      }
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      labelFormatter={(v) =>
                        new Date(v).toLocaleDateString("tr-TR")
                      }
                      formatter={(value) => [value, "Rezervasyon"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#6260e1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Aylık Gelir Trendi</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(v) => {
                        const [y, m] = v.split("-");
                        return new Date(y, m - 1).toLocaleDateString("tr-TR", {
                          month: "short",
                        });
                      }}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `${parseFloat(value).toLocaleString("tr-TR")} ₺`,
                        "Gelir",
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#22c55e"
                      fill="url(#revenueGradient)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Membership Distribution Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Üye Durumu Dağılımı</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-72">
                {membershipDist.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={membershipDist}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="name"
                        strokeWidth={0}
                      >
                        {membershipDist.map((entry, index) => (
                          <Cell
                            key={entry.status}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: "13px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Henüz üyelik verisi yok
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <Link key={action.name} href={action.href}>
                    <div className="group flex items-center justify-between rounded-xl border border-gray-200 p-3.5 transition-all hover:border-gray-300 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color}`}
                        >
                          <action.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {action.name}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Stats Section */}
      {hasAdvancedReports && advanced ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-semibold text-gray-900">
              Gelişmiş Raporlar
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Class Popularity */}
            {advanced.classPopularity?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>En Popüler Sınıflar</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={advanced.classPopularity}
                        layout="vertical"
                        barCategoryGap="15%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          type="number"
                          allowDecimals={false}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="className"
                          width={120}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [value, "Rezervasyon"]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="bookingCount"
                          fill="#6260e1"
                          radius={[0, 6, 6, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trainer Workload */}
            {advanced.trainerWorkload?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Eğitmen İş Yükü (Son 30 Gün)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={advanced.trainerWorkload}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="trainerName"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [value, "Seans"]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="sessionCount"
                          fill="#22c55e"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Occupancy Rate */}
            {advanced.occupancyRate?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Doluluk Oranları</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={advanced.occupancyRate}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="className"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tickFormatter={(v) => `${v}%`}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [
                            `${parseFloat(value).toFixed(1)}%`,
                            "Doluluk",
                          ]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="occupancyRate"
                          fill="#f59e0b"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New Members Trend */}
            {advanced.newMembersTrend?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Yeni Üye Trendi (6 Ay)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={advanced.newMembersTrend}>
                        <defs>
                          <linearGradient
                            id="membersGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8b5cf6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="month"
                          tickFormatter={(v) => {
                            const [y, m] = v.split("-");
                            return new Date(y, m - 1).toLocaleDateString(
                              "tr-TR",
                              { month: "short" },
                            );
                          }}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [value, "Yeni Üye"]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#8b5cf6"
                          fill="url(#membersGradient)"
                          strokeWidth={2.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Revenue by Method */}
            {advanced.revenueByMethod?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ödeme Yöntemine Göre Gelir</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={advanced.revenueByMethod}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="total"
                          nameKey="method"
                          strokeWidth={0}
                        >
                          {advanced.revenueByMethod.map((entry, index) => (
                            <Cell
                              key={entry.method}
                              fill={
                                ADVANCED_COLORS[index % ADVANCED_COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            `${parseFloat(value).toLocaleString("tr-TR")} ₺`,
                            "Gelir",
                          ]}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ fontSize: "13px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : !hasAdvancedReports && usage ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Gelişmiş Raporlar
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              Sınıf popülerliği, eğitmen iş yükü, doluluk oranları ve daha
              fazlası için planınızı yükseltin.
            </p>
            <Link href="/subscription">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 transition-colors">
                <Crown className="h-4 w-4" />
                Planı Yükselt
              </span>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
