"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useMembers } from "@/hooks/useMembers";

const notificationSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  body: z.string().optional(),
  type: z.string().optional(),
  memberId: z.string().optional(),
});

export default function NotificationForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      body: "",
      type: "info",
      memberId: "",
    },
  });

  const { data: membersData, isLoading: membersLoading } = useMembers({
    limit: 100,
  });

  const members = membersData?.data || [];

  if (membersLoading) {
    return <FormSkeleton />;
  }

  const handleFormSubmit = (data) => {
    const payload = { title: data.title };
    if (data.body) payload.body = data.body;
    if (data.type) payload.type = data.type;
    if (data.memberId) payload.memberId = data.memberId;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Başlık *"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea label="İçerik" rows={4} {...register("body")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Tür" error={errors.type?.message} {...register("type")}>
          <option value="info">Bilgi</option>
          <option value="warning">Uyarı</option>
          <option value="reminder">Hatırlatma</option>
          <option value="system">Sistem</option>
        </Select>

        <Select
          label="Üye (İsteğe bağlı)"
          error={errors.memberId?.message}
          {...register("memberId")}
        >
          <option value="">Tüm kullanıcılar</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.first_name} {m.last_name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="outline" onClick={() => history.back()}>
          İptal
        </Button>
        <Button type="submit" loading={isLoading}>
          Bildirim Gönder
        </Button>
      </div>
    </form>
  );
}
