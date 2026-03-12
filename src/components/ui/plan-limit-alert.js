"use client";

import { usePlanUsage } from "@/hooks/useSubscription";
import { AlertTriangle, Lock, Crown } from "lucide-react";
import Link from "next/link";

/**
 * Shows a warning/block alert based on plan limits.
 * @param {"members"|"classes"|"staff"} resource - Which resource to check
 */
export default function PlanLimitAlert({ resource }) {
  const { data: usageData } = usePlanUsage();
  const usage = usageData?.data;

  if (!usage) return null;

  const limitMap = {
    members: {
      limit: usage.limits.max_members,
      current: usage.usage.members,
      label: "üye",
    },
    classes: {
      limit: usage.limits.max_classes,
      current: usage.usage.classes,
      label: "sınıf",
    },
    staff: {
      limit: usage.limits.max_staff,
      current: usage.usage.staff,
      label: "personel",
    },
  };

  const info = limitMap[resource];
  if (!info || info.limit === null || info.limit === undefined) return null;

  const isAtLimit = info.current >= info.limit;
  const isNearLimit = info.current >= info.limit * 0.8;

  if (isAtLimit) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-red-800">
            {info.label.charAt(0).toUpperCase() + info.label.slice(1)} limitine
            ulaştınız ({info.current}/{info.limit})
          </p>
          <p className="text-sm text-red-600">
            Mevcut planınızda daha fazla {info.label} ekleyemezsiniz.{" "}
            <Link
              href="/subscription"
              className="font-medium underline hover:text-red-800"
            >
              Planınızı yükseltin
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (isNearLimit) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            {info.label.charAt(0).toUpperCase() + info.label.slice(1)} limitine
            yaklaşıyorsunuz ({info.current}/{info.limit})
          </p>
        </div>
      </div>
    );
  }

  return null;
}
