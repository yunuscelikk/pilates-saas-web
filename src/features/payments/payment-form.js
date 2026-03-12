"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/useMembers";
import { useMemberships } from "@/hooks/useMemberships";

const paymentSchema = z.object({
  memberId: z.string().min(1, "Üye seçimi gereklidir"),
  membershipId: z.string().optional(),
  amount: z.coerce.number().min(0.01, "Tutar en az 0.01 olmalıdır"),
  paymentMethod: z.string().min(1, "Ödeme yöntemi seçimi gereklidir"),
  paymentDate: z.string().min(1, "Ödeme tarihi gereklidir"),
  currency: z.string().optional(),
  notes: z.string().optional(),
});

export default function PaymentForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      memberId: "",
      membershipId: "",
      amount: "",
      paymentMethod: "",
      paymentDate: new Date().toISOString().split("T")[0],
      currency: "TRY",
      notes: "",
    },
  });

  const selectedMemberId = watch("memberId");

  const { data: membersData, isLoading: membersLoading } = useMembers({
    limit: 100,
  });
  const { data: membershipsData, isLoading: membershipsLoading } =
    useMemberships({
      limit: 100,
      memberId: selectedMemberId || undefined,
    });

  const members = membersData?.data || [];
  const memberships = selectedMemberId
    ? (membershipsData?.data || []).filter(
        (m) => m.member_id === selectedMemberId,
      )
    : [];

  if (membersLoading) {
    return <FormSkeleton />;
  }

  const handleFormSubmit = (data) => {
    const payload = {
      memberId: data.memberId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate,
      currency: data.currency || "TRY",
    };
    if (data.membershipId) payload.membershipId = data.membershipId;
    if (data.notes) payload.notes = data.notes;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
        label="Üyelik (İsteğe bağlı)"
        error={errors.membershipId?.message}
        {...register("membershipId")}
      >
        <option value="">Üyelik seçin</option>
        {memberships.map((m) => (
          <option key={m.id} value={m.id}>
            {m.MembershipPlan?.name || "Plan"} — {m.status} (
            {m.start_date
              ? new Date(m.start_date).toLocaleDateString("tr-TR")
              : ""}
            )
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Tutar *"
          type="number"
          step="0.01"
          min="0"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <Select
          label="Para Birimi"
          error={errors.currency?.message}
          {...register("currency")}
        >
          <option value="TRY">TRY</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Ödeme Yöntemi *"
          error={errors.paymentMethod?.message}
          {...register("paymentMethod")}
        >
          <option value="">Yöntem seçin</option>
          <option value="cash">Nakit</option>
          <option value="credit_card">Kredi Kartı</option>
          <option value="bank_transfer">Havale/EFT</option>
          <option value="other">Diğer</option>
        </Select>
        <Input
          label="Ödeme Tarihi *"
          type="date"
          error={errors.paymentDate?.message}
          {...register("paymentDate")}
        />
      </div>

      <Input
        label="Notlar"
        error={errors.notes?.message}
        {...register("notes")}
      />

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          İptal
        </Button>
        <Button type="submit" loading={isLoading}>
          Ödeme Oluştur
        </Button>
      </div>
    </form>
  );
}
