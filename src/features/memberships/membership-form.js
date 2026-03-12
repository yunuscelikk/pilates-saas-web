"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/useMembers";
import { useMembershipPlans } from "@/hooks/useMembershipPlans";

const membershipSchema = z.object({
  memberId: z.string().min(1, "Üye seçimi gereklidir"),
  membershipPlanId: z.string().min(1, "Plan seçimi gereklidir"),
  startDate: z.string().min(1, "Başlangıç tarihi gereklidir"),
});

export default function MembershipForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(membershipSchema),
    defaultValues: { memberId: "", membershipPlanId: "", startDate: "" },
  });

  const { data: membersData, isLoading: membersLoading } = useMembers({
    limit: 100,
  });
  const { data: plansData, isLoading: plansLoading } = useMembershipPlans({
    limit: 100,
    isActive: true,
  });

  const members = membersData?.data || [];
  const plans = plansData?.data || [];

  const PLAN_TYPE_LABELS = {
    class_pack: "Ders Paketi",
    time_based: "Süre Bazlı",
    unlimited: "Sınırsız",
  };

  if (membersLoading || plansLoading) {
    return <FormSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Select
        label="Üye *"
        error={errors.memberId?.message}
        {...register("memberId")}
      >
        <option value="">Üye seçin</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.first_name} {m.last_name}
            {m.email ? ` (${m.email})` : ""}
          </option>
        ))}
      </Select>

      <Select
        label="Üyelik Planı *"
        error={errors.membershipPlanId?.message}
        {...register("membershipPlanId")}
      >
        <option value="">Plan seçin</option>
        {plans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {PLAN_TYPE_LABELS[p.plan_type] || p.plan_type} —{" "}
            {Number(p.price).toLocaleString("tr-TR")} {p.currency || "TRY"}
          </option>
        ))}
      </Select>

      <Input
        label="Başlangıç Tarihi *"
        type="date"
        error={errors.startDate?.message}
        {...register("startDate")}
      />

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          İptal
        </Button>
        <Button type="submit" loading={isLoading}>
          Üyelik Oluştur
        </Button>
      </div>
    </form>
  );
}
