"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  useMemberships,
  useMembershipStats,
  useDeleteMembership,
} from "@/hooks/useMemberships";
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
import {
  Plus,
  Eye,
  Trash2,
  CreditCard,
  CheckCircle,
  Snowflake,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/permissions";

const STATUS_LABELS = {
  active: "Aktif",
  frozen: "Donduruldu",
  cancelled: "İptal Edildi",
  expired: "Süresi Doldu",
};

const STATUS_VARIANTS = {
  active: "success",
  frozen: "info",
  cancelled: "danger",
  expired: "default",
};

export default function MembershipsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    membership: null,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [previewMembership, setPreviewMembership] = useState(null);

  const { data, isLoading, isError, error } = useMemberships({
    page,
    limit: 20,
    status: status || undefined,
    search: search || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useMembershipStats();
  const deleteMutation = useDeleteMembership();

  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;

  const memberships = data?.data || [];
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

  const handleDelete = async () => {
    if (!deleteModal.membership) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.membership.id);
      setDeleteModal({ open: false, membership: null });
      toast.success("Üyelik başarıyla silindi.");
    } catch {
      toast.error("Üyelik silinirken hata oluştu.");
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
      toast.success(`${selectedIds.length} üyelik başarıyla silindi.`);
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
            onClick={() => setPreviewMembership(row.original)}
          >
            {row.original.Member
              ? `${row.original.Member.first_name} ${row.original.Member.last_name}`
              : "—"}
          </button>
        ),
      },
      {
        id: "plan",
        header: "Plan",
        accessorFn: (row) => row.MembershipPlan?.name || "—",
        enableSorting: false,
      },
      {
        accessorKey: "start_date",
        header: "Başlangıç",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("tr-TR") : "—",
      },
      {
        accessorKey: "end_date",
        header: "Bitiş",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleDateString("tr-TR") : "—",
      },
      {
        accessorKey: "classes_remaining",
        header: "Kalan Ders",
        cell: ({ getValue }) => (getValue() != null ? getValue() : "—"),
        enableSorting: false,
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
            <Link href={`/memberships/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDeleteModal({ open: true, membership: row.original })
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
      <PageHeader title="Üyelikler" description="Üyelik kayıtlarını yönetin.">
        <Link href="/memberships/create">
          <Button>
            <Plus className="h-4 w-4" />
            Yeni Üyelik
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          name="Toplam Üyelik"
          value={stats?.totalMemberships}
          icon={BarChart3}
          color="bg-brand-light text-brand"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Aktif Üyelik"
          value={stats?.activeMemberships}
          icon={CheckCircle}
          color="bg-emerald-100 text-emerald-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Dondurulmuş"
          value={stats?.frozenMemberships}
          icon={Snowflake}
          color="bg-blue-100 text-blue-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Süresi Dolacak"
          value={stats?.expiringSoon}
          icon={AlertTriangle}
          color="bg-amber-100 text-amber-600"
          isLoading={statsLoading}
        />
      </div>

      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Üye adı ile ara..."
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
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="frozen">Donduruldu</option>
            <option value="cancelled">İptal Edildi</option>
            <option value="expired">Süresi Doldu</option>
          </select>
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message ||
            "Üyelikler yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={memberships}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection={isOwner}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: CreditCard,
            title:
              search || status
                ? "Arama sonucu bulunamadı"
                : "Henüz üyelik oluşturulmamış",
            description:
              search || status
                ? "Farklı filtrelerle tekrar deneyin."
                : "İlk üyeliği oluşturarak başlayın.",
            children: !search && !status && (
              <Link href="/memberships/create">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  İlk Üyeliği Oluştur
                </Button>
              </Link>
            ),
          }}
        />
      )}

      {/* Row Preview Panel */}
      <RowPreviewPanel
        open={!!previewMembership}
        onOpenChange={(open) => !open && setPreviewMembership(null)}
        title="Üyelik Detayı"
      >
        {previewMembership && (
          <dl className="space-y-3">
            <PreviewField
              label="Üye"
              value={
                previewMembership.Member
                  ? `${previewMembership.Member.first_name} ${previewMembership.Member.last_name}`
                  : undefined
              }
            />
            <PreviewField
              label="Plan"
              value={previewMembership.MembershipPlan?.name}
            />
            <PreviewField
              label="Durum"
              value={
                STATUS_LABELS[previewMembership.status] ||
                previewMembership.status
              }
            />
            <PreviewField
              label="Başlangıç Tarihi"
              value={
                previewMembership.start_date
                  ? new Date(previewMembership.start_date).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <PreviewField
              label="Bitiş Tarihi"
              value={
                previewMembership.end_date
                  ? new Date(previewMembership.end_date).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <PreviewField
              label="Kalan Ders"
              value={
                previewMembership.classes_remaining != null
                  ? String(previewMembership.classes_remaining)
                  : undefined
              }
            />
            <PreviewField
              label="Oluşturma Tarihi"
              value={
                previewMembership.created_at
                  ? new Date(previewMembership.created_at).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <div className="pt-3 border-t">
              <Link href={`/memberships/${previewMembership.id}`}>
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
        onClose={() => setDeleteModal({ open: false, membership: null })}
        title="Üyeliği Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {deleteModal.membership?.Member?.first_name}{" "}
            {deleteModal.membership?.Member?.last_name}
          </span>{" "}
          adlı üyenin üyelik kaydını silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, membership: null })}
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
