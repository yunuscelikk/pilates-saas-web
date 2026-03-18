"use client";

import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats, useAdvancedStats } from "@/hooks/useDashboard";
import { usePlanUsage } from "@/hooks/useSubscription";
import PageHeader from "@/components/ui/page-header";
import DashboardStatsCards from "@/components/dashboard/stats-cards";
import OverviewChart from "@/components/dashboard/overview-chart";
import RevenueChart from "@/components/dashboard/revenue-chart";
import MembershipChart from "@/components/dashboard/membership-chart";
import QuickActions from "@/components/dashboard/quick-actions";
import DashboardPlanUsage from "@/components/dashboard/plan-usage";
import AdvancedReports from "@/components/dashboard/advanced-reports";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Hoş geldin, ${user?.first_name || ""}!`}
        description="İşte stüdyonuzun güncel durumu."
      />

      {/* Stats Cards - 4 columns like shadcn */}
      <DashboardStatsCards summary={summary} isLoading={isLoading} />

      {/* Main Content Grid - shadcn pattern: 7-col layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Overview Chart - takes 4 cols */}
        <div className="lg:col-span-4">
          <OverviewChart data={charts?.dailyBookings} isLoading={isLoading} />
        </div>

        {/* Right Panel - takes 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <MembershipChart
            data={charts?.membershipDistribution}
            isLoading={isLoading}
          />
          <QuickActions />
        </div>
      </div>

      {/* Revenue Chart - full width */}
      <RevenueChart data={charts?.monthlyRevenue} isLoading={isLoading} />

      {/* Plan Usage & Subscription */}
      <DashboardPlanUsage
        usage={usage}
        subscription={user?.Studio?.Subscription}
      />

      {/* Advanced Reports */}
      <AdvancedReports
        advanced={advanced}
        hasAdvancedReports={!!hasAdvancedReports}
        showUpsell={!hasAdvancedReports && !!usage}
      />
    </div>
  );
}
