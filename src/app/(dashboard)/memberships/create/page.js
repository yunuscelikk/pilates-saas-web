"use client";

import { useRouter } from "next/navigation";
import { useCreateMembership } from "@/hooks/useMemberships";
import MembershipForm from "@/features/memberships/membership-form";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateMembershipPage() {
  const router = useRouter();
  const createMutation = useCreateMembership();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Üyelik başarıyla oluşturuldu.");
      router.push("/memberships");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Üyelik oluşturulurken hata oluştu.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/memberships">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Üyelik Oluştur"
          description="Bir üye için üyelik planı başlatın."
        />
      </div>

      <Card>
        <CardContent>
          <MembershipForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
