"use client";

import Link from "next/link";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { TrendingUp, Crown, Lock } from "lucide-react";
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

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  fontSize: "13px",
};

function ChartCard({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function AdvancedReports({
  advanced,
  hasAdvancedReports,
  showUpsell,
}) {
  // Upsell card for users without advanced reports
  if (!hasAdvancedReports && showUpsell) {
    return (
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
    );
  }

  if (!hasAdvancedReports || !advanced) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-brand" />
        <h2 className="text-lg font-semibold text-gray-900">
          Gelişmiş Raporlar
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Class Popularity */}
        {advanced.classPopularity?.length > 0 && (
          <ChartCard title="En Popüler Sınıflar">
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
                  stroke="#94a3b8"
                />
                <YAxis
                  type="category"
                  dataKey="className"
                  width={120}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                />
                <Tooltip
                  formatter={(value) => [value, "Rezervasyon"]}
                  contentStyle={tooltipStyle}
                />
                <Bar
                  dataKey="bookingCount"
                  fill="#6260e1"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Trainer Workload */}
        {advanced.trainerWorkload?.length > 0 && (
          <ChartCard title="Eğitmen İş Yükü (Son 30 Gün)">
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
                  stroke="#94a3b8"
                />
                <YAxis
                  allowDecimals={false}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                />
                <Tooltip
                  formatter={(value) => [value, "Seans"]}
                  contentStyle={tooltipStyle}
                />
                <Bar
                  dataKey="sessionCount"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Occupancy Rate */}
        {advanced.occupancyRate?.length > 0 && (
          <ChartCard title="Doluluk Oranları">
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
                  stroke="#94a3b8"
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                />
                <Tooltip
                  formatter={(value) => [
                    `${parseFloat(value).toFixed(1)}%`,
                    "Doluluk",
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Bar
                  dataKey="occupancyRate"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* New Members Trend */}
        {advanced.newMembersTrend?.length > 0 && (
          <ChartCard title="Yeni Üye Trendi (6 Ay)">
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
                      stopOpacity={0.15}
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
                    return new Date(y, m - 1).toLocaleDateString("tr-TR", {
                      month: "short",
                    });
                  }}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                />
                <YAxis
                  allowDecimals={false}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                />
                <Tooltip
                  formatter={(value) => [value, "Yeni Üye"]}
                  contentStyle={tooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  fill="url(#membersGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Revenue by Method */}
        {advanced.revenueByMethod?.length > 0 && (
          <ChartCard title="Ödeme Yöntemine Göre Gelir">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={advanced.revenueByMethod}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="method"
                  strokeWidth={0}
                >
                  {advanced.revenueByMethod.map((entry, index) => (
                    <Cell
                      key={entry.method}
                      fill={ADVANCED_COLORS[index % ADVANCED_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${parseFloat(value).toLocaleString("tr-TR")} ₺`,
                    "Gelir",
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
}
