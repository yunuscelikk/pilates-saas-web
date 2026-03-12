"use client";

import { useRouter } from "next/navigation";
import { useCreateMember } from "@/hooks/useMembers";
import MemberForm from "@/features/members/member-form";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import PlanLimitAlert from "@/components/ui/plan-limit-alert";

export default function CreateMemberPage() {
  const router = useRouter();
  const createMutation = useCreateMember();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Üye başarıyla oluşturuldu.");
      router.push("/members");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Üye oluşturulurken hata oluştu.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/members">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Üye Ekle"
          description="Stüdyoya yeni bir üye kaydedin."
        />
      </div>

      <PlanLimitAlert resource="members" />

      {/* Form */}
      <Card>
        <CardContent>
          <MemberForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
