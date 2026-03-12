"use client";

import { useRouter } from "next/navigation";
import { useCreateTrainer } from "@/hooks/useTrainers";
import TrainerForm from "@/features/trainers/trainer-form";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateTrainerPage() {
  const router = useRouter();
  const createMutation = useCreateTrainer();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Eğitmen başarıyla oluşturuldu.");
      router.push("/trainers");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Eğitmen oluşturulurken hata oluştu.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/trainers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Eğitmen Ekle"
          description="Stüdyoya yeni bir eğitmen kaydedin."
        />
      </div>

      <Card>
        <CardContent>
          <TrainerForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
