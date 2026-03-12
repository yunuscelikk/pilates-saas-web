"use client";

import { useRouter } from "next/navigation";
import { useCreateClass } from "@/hooks/useClasses";
import ClassForm from "@/features/classes/class-form";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import PlanLimitAlert from "@/components/ui/plan-limit-alert";

export default function CreateClassPage() {
  const router = useRouter();
  const createMutation = useCreateClass();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Sınıf başarıyla oluşturuldu.");
      router.push("/classes");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Sınıf oluşturulurken hata oluştu.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/classes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Sınıf Ekle"
          description="Stüdyoya yeni bir sınıf tanımlayın."
        />
      </div>

      <PlanLimitAlert resource="classes" />

      <Card>
        <CardContent>
          <ClassForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
