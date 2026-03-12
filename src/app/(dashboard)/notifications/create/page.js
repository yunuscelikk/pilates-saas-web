"use client";

import { useRouter } from "next/navigation";
import { useCreateNotification } from "@/hooks/useNotifications";
import NotificationForm from "@/features/notifications/notification-form";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateNotificationPage() {
  const router = useRouter();
  const createMutation = useCreateNotification();

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Bildirim başarıyla oluşturuldu.");
      router.push("/notifications");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Bildirim oluşturulurken hata oluştu.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/notifications">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Yeni Bildirim"
          description="Üyelere veya sisteme bildirim gönderin."
        />
      </div>

      <Card>
        <CardContent>
          <NotificationForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
