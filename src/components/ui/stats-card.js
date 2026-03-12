import Card, { CardContent } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  name,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = "bg-brand-light text-brand",
  isLoading,
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all hover:shadow-md hover:border-gray-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{name}</p>
            <p className="text-2xl font-bold tracking-tight text-gray-900">
              {value ?? "—"}
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
          {Icon && (
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
