"use client";

import Card, {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  fontSize: "13px",
};

export default function OverviewChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const dailyBookings = data || [];
  const hasData = dailyBookings.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genel Bakış</CardTitle>
        <CardDescription>Son 7 günlük rezervasyon durumu</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[350px]">
          {hasData ? (
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
                  labelFormatter={(v) =>
                    new Date(v).toLocaleDateString("tr-TR")
                  }
                  formatter={(value) => [value, "Rezervasyon"]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="count" fill="#6260e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Henüz rezervasyon verisi yok
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
