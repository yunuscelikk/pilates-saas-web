"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";
import DataTableToolbar from "@/components/ui/data-table-toolbar";
import DataTablePagination from "@/components/ui/data-table-pagination";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";
import { ROLES } from "@/lib/permissions";
import { Plus, Bell, CheckCheck, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

const TYPE_LABELS = {
  info: "Bilgi",
  warning: "Uyarı",
  reminder: "Hatırlatma",
  system: "Sistem",
};

const TYPE_VARIANTS = {
  info: "info",
  warning: "warning",
  reminder: "default",
  system: "danger",
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "Az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
  return date.toLocaleDateString("tr-TR");
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [isRead, setIsRead] = useState("");

  const { data, isLoading, isError, error } = useNotifications({
    page,
    limit: 20,
    type: type || undefined,
    isRead: isRead || undefined,
  });

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = data?.data || [];
  const meta = data?.meta || null;

  const handleMarkRead = async (id) => {
    try {
      await markReadMutation.mutateAsync(id);
      toast.success("Bildirim okundu olarak işaretlendi.");
    } catch {
      toast.error("Bildirim güncellenirken hata oluştu.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      toast.success("Tüm bildirimler okundu olarak işaretlendi.");
    } catch {
      toast.error("Bildirimler güncellenirken hata oluştu.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Bildirim başarıyla silindi.");
    } catch {
      toast.error("Bildirim silinirken hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bildirimler"
        description="Sistem bildirimlerini görüntüleyin ve yönetin."
      >
        <Button
          variant="secondary"
          onClick={handleMarkAllRead}
          loading={markAllReadMutation.isPending}
        >
          <CheckCheck className="h-4 w-4" />
          Tümünü Okundu İşaretle
        </Button>
        <Link href="/notifications/create">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Bildirim
          </Button>
        </Link>
      </PageHeader>

      <DataTableToolbar
        filters={
          <>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Tüm Türler</option>
              <option value="info">Bilgi</option>
              <option value="warning">Uyarı</option>
              <option value="reminder">Hatırlatma</option>
              <option value="system">Sistem</option>
            </select>
            <select
              value={isRead}
              onChange={(e) => {
                setIsRead(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Tümü</option>
              <option value="false">Okunmamış</option>
              <option value="true">Okunmuş</option>
            </select>
          </>
        }
      />

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-2 w-2 rounded-full mt-2" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message ||
            "Bildirimler yüklenirken hata oluştu."}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={
            type || isRead
              ? "Filtrelere uygun bildirim bulunamadı"
              : "Henüz bildirim yok"
          }
          description={
            type || isRead
              ? "Farklı filtrelerle tekrar deneyin."
              : "Yeni bildirimler burada görünecek."
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border bg-white p-4 transition-colors ${
                  notification.is_read
                    ? "border-gray-200"
                    : "border-primary-200 bg-brand-light/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
                      )}
                      <h3
                        className={`text-sm font-medium ${
                          notification.is_read
                            ? "text-gray-700"
                            : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <Badge
                        variant={TYPE_VARIANTS[notification.type] || "default"}
                      >
                        {TYPE_LABELS[notification.type] || notification.type}
                      </Badge>
                    </div>
                    {notification.body && (
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.body}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {timeAgo(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {meta && <DataTablePagination meta={meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}
