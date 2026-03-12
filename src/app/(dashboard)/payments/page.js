"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  usePayments,
  usePaymentStats,
  useDeletePayment,
} from "@/hooks/usePayments";
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
import { Plus, Eye, Trash2, DollarSign, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_LABELS = {
  pending: "Beklemede",
  completed: "Tamamlandı",
  failed: "Başarısız",
  refunded: "İade Edildi",
};

const STATUS_VARIANTS = {
  pending: "warning",
  completed: "success",
  failed: "danger",
  refunded: "info",
};

const METHOD_LABELS = {
  cash: "Nakit",
  credit_card: "Kredi Kartı",
  bank_transfer: "Havale/EFT",
  other: "Diğer",
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    payment: null,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [previewPayment, setPreviewPayment] = useState(null);

  const { data, isLoading, isError, error } = usePayments({
    page,
    limit: 20,
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = usePaymentStats();

  const deleteMutation = useDeletePayment();

  const payments = data?.data || [];
  const meta = data?.meta || null;
  const stats = statsData?.data;

  const handleDelete = async () => {
    if (!deleteModal.payment) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.payment.id);
      setDeleteModal({ open: false, payment: null });
      toast.success("Ödeme kaydı başarıyla silindi.");
    } catch {
      toast.error("Ödeme silinirken hata oluştu.");
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
      toast.success(`${selectedIds.length} ödeme kaydı başarıyla silindi.`);
    } catch {
      toast.error("Toplu silme sırasında hata oluştu.");
    }
  };

  const columns = useMemo(
    () => [
      ...(isOwner ? [getSelectionColumn()] : []),
      {
        id: "member",
        header: "Üye",
        accessorFn: (row) =>
          row.Member ? `${row.Member.first_name} ${row.Member.last_name}` : "—",
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer font-medium text-left hover:text-brand transition-colors"
            onClick={() => setPreviewPayment(row.original)}
          >
            {row.original.Member
              ? `${row.original.Member.first_name} ${row.original.Member.last_name}`
              : "—"}
          </button>
        ),
      },
      {
        accessorKey: "amount",
        header: "Tutar",
        cell: ({ row }) =>
          `${parseFloat(row.original.amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${row.original.currency || "TRY"}`,
      },
      {
        accessorKey: "payment_method",
        header: "Yöntem",
        cell: ({ getValue }) => METHOD_LABELS[getValue()] || getValue(),
        enableSorting: false,
      },
      {
        accessorKey: "payment_date",
        header: "Tarih",
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
            <Link href={`/payments/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDeleteModal({ open: true, payment: row.original })
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
        title="Ödemeler"
        description="Ödeme kayıtlarını görüntüleyin ve yönetin."
      >
        <Link href="/payments/create">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Ödeme
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          name="Bugünkü Gelir"
          value={
            stats?.revenueToday !== undefined
              ? `${parseFloat(stats.revenueToday).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`
              : undefined
          }
          icon={DollarSign}
          color="bg-emerald-100 text-emerald-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Bu Ay Gelir"
          value={
            stats?.revenueThisMonth !== undefined
              ? `${parseFloat(stats.revenueThisMonth).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`
              : undefined
          }
          icon={TrendingUp}
          color="bg-brand-light text-brand"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Bekleyen Ödemeler"
          value={stats?.pendingPayments}
          icon={Clock}
          color="bg-amber-100 text-amber-600"
          isLoading={statsLoading}
        />
      </div>

      {/* Monthly Revenue Chart */}
      {stats?.monthlyChart && stats.monthlyChart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aylık Gelir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyChart}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6260e1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6260e1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(val) => {
                      const [y, m] = val.split("-");
                      return new Date(y, m - 1).toLocaleDateString("tr-TR", {
                        month: "short",
                      });
                    }}
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(val) =>
                      val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
                    }
                    fontSize={12}
                  />
                  <Tooltip
                    labelFormatter={(val) => {
                      const [y, m] = val.split("-");
                      return new Date(y, m - 1).toLocaleDateString("tr-TR", {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value) => [
                      `${parseFloat(value).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺`,
                      "Gelir",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#6260e1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTableToolbar
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
        bulkActions={
          isOwner ? (
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4" />
              Seçilenleri Sil
            </Button>
          ) : null
        }
        filters={
          <>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="completed">Tamamlandı</option>
              <option value="failed">Başarısız</option>
              <option value="refunded">İade Edildi</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              placeholder="Başlangıç"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              placeholder="Bitiş"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </>
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message ||
            "Ödemeler yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection={isOwner}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: DollarSign,
            title:
              status || startDate || endDate
                ? "Filtrelere uygun ödeme bulunamadı"
                : "Henüz ödeme kaydı oluşturulmamış",
            description:
              status || startDate || endDate
                ? "Farklı filtrelerle tekrar deneyin."
                : "İlk ödeme kaydınızı oluşturun.",
            children: !status && !startDate && !endDate && (
              <Link href="/payments/create">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  İlk Ödemeyi Oluştur
                </Button>
              </Link>
            ),
          }}
        />
      )}

      {/* Row Preview Panel */}
      <RowPreviewPanel
        open={!!previewPayment}
        onOpenChange={(open) => !open && setPreviewPayment(null)}
        title="Ödeme Detayı"
      >
        {previewPayment && (
          <dl className="space-y-3">
            <PreviewField
              label="Üye"
              value={
                previewPayment.Member
                  ? `${previewPayment.Member.first_name} ${previewPayment.Member.last_name}`
                  : undefined
              }
            />
            <PreviewField
              label="Tutar"
              value={`${parseFloat(previewPayment.amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${previewPayment.currency || "TRY"}`}
            />
            <PreviewField
              label="Yöntem"
              value={
                METHOD_LABELS[previewPayment.payment_method] ||
                previewPayment.payment_method
              }
            />
            <PreviewField
              label="Durum"
              value={
                STATUS_LABELS[previewPayment.status] || previewPayment.status
              }
            />
            <PreviewField
              label="Ödeme Tarihi"
              value={
                previewPayment.payment_date
                  ? new Date(previewPayment.payment_date).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            {previewPayment.notes && (
              <PreviewField label="Notlar" value={previewPayment.notes} />
            )}
            <div className="pt-3 border-t">
              <Link href={`/payments/${previewPayment.id}`}>
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
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, payment: null })}
        title="Ödeme Kaydını Sil"
      >
        <p className="text-sm text-gray-600">
          Bu ödeme kaydını kalıcı olarak silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, payment: null })}
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
