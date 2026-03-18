"use client";

import Link from "next/link";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { Users, CalendarDays, UserCog, Crown } from "lucide-react";

function UsageBar({ label, current, limit, icon: Icon, color }) {
  const isUnlimited = limit === null || limit === undefined;
  const percentage = isUnlimited ? 100 : Math.min((current / limit) * 100, 100);
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
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div
          className={`h-1.5 rounded-full transition-all ${
            isUnlimited
              ? "bg-emerald-500"
              : isAtLimit
                ? "bg-red-500"
                : isNearLimit
                  ? "bg-amber-500"
                  : "bg-brand"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPlanUsage({ usage, subscription }) {
  if (!usage && !subscription) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Subscription Status */}
      {subscription && (
        <Link href="/subscription">
          <Card className="h-full transition-all hover:shadow-md hover:border-gray-300">
            <CardContent className="flex h-full items-center gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                <Crown className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">Abonelik Planı</p>
                <p className="font-semibold text-gray-900">
                  {subscription.Plan?.name || "—"}
                </p>
              </div>
              <Badge
                variant={
                  subscription.status === "active"
                    ? "success"
                    : subscription.status === "trialing"
                      ? "info"
                      : "warning"
                }
              >
                {subscription.status === "active"
                  ? "Aktif"
                  : subscription.status === "trialing"
                    ? "Deneme"
                    : subscription.status === "past_due"
                      ? "Ödeme Gecikmiş"
                      : subscription.status === "canceled"
                        ? "İptal"
                        : "Süresi Doldu"}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Plan Usage */}
      {usage && (
        <Card className={subscription ? "" : "lg:col-span-2"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Plan Kullanımı</CardTitle>
              <Badge variant="info">{usage.plan?.name}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
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
    </div>
  );
}
