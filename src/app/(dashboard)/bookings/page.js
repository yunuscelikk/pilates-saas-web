"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  useBookings,
  useBookingStats,
  useCancelBooking,
  useDeleteBooking,
} from "@/hooks/useBookings";
import DataTable, { getSelectionColumn } from "@/components/ui/data-table";
import DataTableToolbar from "@/components/ui/data-table-toolbar";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import RowPreviewPanel, {
  PreviewField,
} from "@/components/ui/row-preview-panel";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/lib/permissions";
import {
  Plus,
  Eye,
  XCircle,
  Trash2,
  BookOpen,
  CalendarCheck,
  Clock,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_LABELS = {
  confirmed: "Onaylandı",
  waitlisted: "Bekleme Listesi",
  cancelled: "İptal Edildi",
  no_show: "Gelmedi",
};

const STATUS_VARIANTS = {
  confirmed: "success",
  waitlisted: "warning",
  cancelled: "danger",
  no_show: "default",
};

export default function BookingsPage() {
  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [cancelModal, setCancelModal] = useState({
    open: false,
    booking: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    booking: null,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [previewBooking, setPreviewBooking] = useState(null);

  const { data, isLoading, isError, error } = useBookings({
    page,
    limit: 20,
    status: status || undefined,
    search: search || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useBookingStats();

  const cancelMutation = useCancelBooking();
  const deleteMutation = useDeleteBooking();

  const bookings = data?.data || [];
  const meta = data?.meta || null;
  const stats = statsData?.data;

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setPage(1);
      setSearch(searchInput);
    },
    [searchInput],
  );

  const handleCancel = async () => {
    if (!cancelModal.booking) return;
    try {
      await cancelMutation.mutateAsync(cancelModal.booking.id);
      setCancelModal({ open: false, booking: null });
      toast.success("Rezervasyon başarıyla iptal edildi.");
    } catch {
      toast.error("Rezervasyon iptal edilirken hata oluştu.");
    }
  };

  const handleBulkCancel = async () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) => cancelMutation.mutateAsync(id)),
      );
      setRowSelection({});
      toast.success(
        `${selectedIds.length} rezervasyon başarıyla iptal edildi.`,
      );
    } catch {
      toast.error("Toplu iptal sırasında hata oluştu.");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.booking) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.booking.id);
      setDeleteModal({ open: false, booking: null });
      toast.success("Rezervasyon başarıyla silindi.");
    } catch {
      toast.error("Rezervasyon silinirken hata oluştu.");
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id)),
      );
      setRowSelection({});
      toast.success(`${selectedIds.length} rezervasyon başarıyla silindi.`);
    } catch {
      toast.error("Toplu silme sırasında hata oluştu.");
    }
  };

  const columns = useMemo(
    () => [
      getSelectionColumn(),
      {
        id: "member",
        header: "Üye",
        accessorFn: (row) =>
          row.Member ? `${row.Member.first_name} ${row.Member.last_name}` : "—",
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer font-medium text-left hover:text-brand transition-colors"
            onClick={() => setPreviewBooking(row.original)}
          >
            {row.original.Member
              ? `${row.original.Member.first_name} ${row.original.Member.last_name}`
              : "—"}
          </button>
        ),
      },
      {
        id: "class",
        header: "Sınıf",
        accessorFn: (row) =>
          row.ClassSession?.Class?.name || row.ClassSession?.class_id || "—",
        enableSorting: false,
      },
      {
        id: "date",
        header: "Tarih",
        accessorFn: (row) => row.ClassSession?.start_time,
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("tr-TR") : "—",
      },
      {
        accessorKey: "status",
        header: "Durum",
        cell: ({ getValue }) => (
          <Badge variant={STATUS_VARIANTS[getValue()] || "default"}>
            {STATUS_LABELS[getValue()] || getValue()}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">İşlemler</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/bookings/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {(row.original.status === "confirmed" ||
              row.original.status === "waitlisted") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCancelModal({ open: true, booking: row.original })
                }
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            )}
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDeleteModal({ open: true, booking: row.original })
                }
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        ),
        enableSorting: false,
      },
    ],
    [isOwner],
  );

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rezervasyonlar"
        description="Seans rezervasyonlarını yönetin."
      >
        <Link href="/bookings/create">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Rezervasyon
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          name="Bugünkü Rezervasyon"
          value={stats?.bookingsToday}
          icon={CalendarCheck}
          color="bg-emerald-100 text-emerald-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Bugün İptal"
          value={stats?.cancelledToday}
          icon={Ban}
          color="bg-red-100 text-red-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Bekleme Listesi"
          value={stats?.pendingCount}
          icon={Clock}
          color="bg-amber-100 text-amber-600"
          isLoading={statsLoading}
        />
      </div>

      {/* Daily Bookings Chart */}
      {stats?.dailyChart && stats.dailyChart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Son 7 Gün Rezervasyonlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip
                    labelFormatter={(val) =>
                      new Date(val).toLocaleDateString("tr-TR")
                    }
                    formatter={(value) => [value, "Rezervasyon"]}
                  />
                  <Bar dataKey="count" fill="#6260e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Üye adı ile ara..."
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
        bulkActions={
          <>
            <Button variant="danger" size="sm" onClick={handleBulkCancel}>
              <XCircle className="h-4 w-4" />
              Seçilenleri İptal Et
            </Button>
            {isOwner && (
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4" />
                Seçilenleri Sil
              </Button>
            )}
          </>
        }
        filters={
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Tüm Durumlar</option>
            <option value="confirmed">Onaylandı</option>
            <option value="waitlisted">Bekleme Listesi</option>
            <option value="cancelled">İptal Edildi</option>
            <option value="no_show">Gelmedi</option>
          </select>
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message ||
            "Rezervasyonlar yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: BookOpen,
            title:
              search || status
                ? "Arama sonucu bulunamadı"
                : "Henüz rezervasyon oluşturulmamış",
            description:
              search || status
                ? "Farklı filtrelerle tekrar deneyin."
                : "İlk rezervasyonunuzu oluşturarak başlayın.",
            children: !search && !status && (
              <Link href="/bookings/create">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  İlk Rezervasyonu Oluştur
                </Button>
              </Link>
            ),
          }}
        />
      )}

      {/* Row Preview Panel */}
      <RowPreviewPanel
        open={!!previewBooking}
        onOpenChange={(open) => !open && setPreviewBooking(null)}
        title="Rezervasyon Detayı"
      >
        {previewBooking && (
          <dl className="space-y-3">
            <PreviewField
              label="Üye"
              value={
                previewBooking.Member
                  ? `${previewBooking.Member.first_name} ${previewBooking.Member.last_name}`
                  : undefined
              }
            />
            <PreviewField
              label="Sınıf"
              value={
                previewBooking.ClassSession?.Class?.name ||
                previewBooking.ClassSession?.class_id
              }
            />
            <PreviewField
              label="Seans Tarihi"
              value={
                previewBooking.ClassSession?.start_time
                  ? new Date(
                      previewBooking.ClassSession.start_time,
                    ).toLocaleString("tr-TR")
                  : undefined
              }
            />
            <PreviewField
              label="Durum"
              value={
                STATUS_LABELS[previewBooking.status] || previewBooking.status
              }
            />
            <PreviewField
              label="Rezervasyon Tarihi"
              value={
                previewBooking.booked_at
                  ? new Date(previewBooking.booked_at).toLocaleString("tr-TR")
                  : undefined
              }
            />
            {previewBooking.cancelled_at && (
              <PreviewField
                label="İptal Tarihi"
                value={new Date(previewBooking.cancelled_at).toLocaleString(
                  "tr-TR",
                )}
              />
            )}
            <div className="pt-3 border-t">
              <Link href={`/bookings/${previewBooking.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4" />
                  Detay Sayfasına Git
                </Button>
              </Link>
            </div>
          </dl>
        )}
      </RowPreviewPanel>

      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, booking: null })}
        title="Rezervasyonu İptal Et"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {cancelModal.booking?.Member?.first_name}{" "}
            {cancelModal.booking?.Member?.last_name}
          </span>{" "}
          adlı üyenin rezervasyonunu iptal etmek istediğinize emin misiniz?
        </p>
        {cancelModal.booking?.status === "confirmed" && (
          <p className="mt-2 text-sm text-brand">
            Onaylı bir rezervasyonun iptali halinde bekleme listesindeki ilk
            kişi otomatik olarak onaylanacaktır.
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setCancelModal({ open: false, booking: null })}
          >
            Vazgeç
          </Button>
          <Button
            variant="danger"
            loading={cancelMutation.isPending}
            onClick={handleCancel}
          >
            İptal Et
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, booking: null })}
        title="Rezervasyonu Sil"
      >
        <p className="text-sm text-gray-600">
          Bu rezervasyonu kalıcı olarak silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, booking: null })}
          >
            İptal
          </Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
}
