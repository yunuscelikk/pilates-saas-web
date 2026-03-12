"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AlertTriangle, Clock, ArrowRight } from "lucide-react";

export default function TrialBanner() {
  const { user } = useAuth();

  const subscription = user?.Studio?.Subscription;
  if (!subscription || subscription.status !== "trialing") return null;

  const trialEnd = new Date(subscription.trial_ends_at);
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)),
  );
  const isUrgent = daysLeft <= 3;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm ${
        isUrgent
          ? "bg-red-50 text-red-800 border border-red-200"
          : "bg-amber-50 text-amber-800 border border-amber-200"
      }`}
    >
      <div className="flex items-center gap-2">
        {isUrgent ? (
          <AlertTriangle className="h-4 w-4 shrink-0" />
        ) : (
          <Clock className="h-4 w-4 shrink-0" />
        )}
        <span>
          Deneme sürenizin bitmesine{" "}
          <span className="font-semibold">{daysLeft} gün</span> kaldı.
          {isUrgent && " Hemen planınızı yükseltin!"}
        </span>
      </div>
      <Link
        href="/subscription"
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
          isUrgent
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-amber-600 text-white hover:bg-amber-700"
        }`}
      >
        Planı Yükselt
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
