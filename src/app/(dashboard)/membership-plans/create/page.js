"use client";

import { useRouter } from "next/navigation";
import { useCreateMembershipPlan } from "@/hooks/useMembershipPlans";
import MembershipPlanForm from "@/features/membership-plans/membership-plan-form";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateMembershipPlanPage() {
  const router = useRouter();
  const createMutation = useCreateMembershipPlan();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Plan başarıyla oluşturuldu.");
      router.push("/membership-plans");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Plan oluşturulurken hata oluştu.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/membership-plans">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Plan"
          description="Yeni bir üyelik planı oluşturun."
        />
      </div>

      <Card>
        <CardContent>
          <MembershipPlanForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
