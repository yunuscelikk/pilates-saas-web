"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useMembershipPlans,
  useDeleteMembershipPlan,
} from "@/hooks/useMembershipPlans";
import DataTable, { getSelectionColumn } from "@/components/ui/data-table";
import DataTableToolbar from "@/components/ui/data-table-toolbar";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Modal from "@/components/ui/modal";
import PageHeader from "@/components/ui/page-header";
import { Plus, Eye, Trash2, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/permissions";
import Link from "next/link";

const PLAN_TYPE_LABELS = {
  class_pack: "Ders Paketi",
  time_based: "Süre Bazlı",
  unlimited: "Sınırsız",
};

const PLAN_TYPE_VARIANTS = {
  class_pack: "info",
  time_based: "warning",
  unlimited: "success",
};

export default function MembershipPlansPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [planType, setPlanType] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading, isError, error } = useMembershipPlans({
    page,
    limit: 10,
    search: search || undefined,
    planType: planType || undefined,
  });

  const deleteMutation = useDeleteMembershipPlan();

  const { user } = useAuth();
  const isOwner = user?.role === ROLES.OWNER;

  const plans = data?.data || [];
  const meta = data?.meta || {};

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      toast.success("Plan başarıyla silindi.");
    } catch {
      toast.error("Plan silinirken hata oluştu.");
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
      toast.success(`${selectedIds.length} plan başarıyla silindi.`);
    } catch {
      toast.error("Toplu silme sırasında hata oluştu.");
    }
  };

  const columns = useMemo(
    () => [
      ...(isOwner ? [getSelectionColumn()] : []),
      {
        accessorKey: "name",
        header: "Ad",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue()}</span>
        ),
      },
      {
        accessorKey: "plan_type",
        header: "Tip",
        cell: ({ getValue }) => (
          <Badge variant={PLAN_TYPE_VARIANTS[getValue()] || "default"}>
            {PLAN_TYPE_LABELS[getValue()] || getValue()}
          </Badge>
        ),
      },
      {
        id: "duration_classes",
        header: "Süre / Ders",
        cell: ({ row }) => {
          const plan = row.original;
          if (plan.plan_type === "class_pack")
            return `${plan.classes_included} ders`;
          if (plan.plan_type === "time_based")
            return `${plan.duration_days} gün`;
          return "Sınırsız";
        },
        enableSorting: false,
      },
      {
        accessorKey: "price",
        header: "Fiyat",
        cell: ({ row }) =>
          `${Number(row.original.price).toLocaleString("tr-TR")} ${row.original.currency || "TRY"}`,
      },
      {
        accessorKey: "is_active",
        header: "Durum",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "success" : "default"}>
            {getValue() ? "Aktif" : "Pasif"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">İşlemler</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/membership-plans/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(row.original)}
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
        title="Üyelik Planları"
        description="Tüm üyelik planlarını görüntüleyin ve yönetin."
      >
        <Button onClick={() => router.push("/membership-plans/create")}>
          <Plus className="h-4 w-4" />
          Yeni Plan
        </Button>
      </PageHeader>

      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Plan ara..."
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
            value={planType}
            onChange={(e) => {
              setPlanType(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Tüm Tipler</option>
            <option value="class_pack">Ders Paketi</option>
            <option value="time_based">Süre Bazlı</option>
            <option value="unlimited">Sınırsız</option>
          </select>
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message || "Planlar yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={plans}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection={isOwner}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: ClipboardList,
            title:
              search || planType
                ? "Üyelik planı bulunamadı"
                : "Henüz plan oluşturulmamış",
            description:
              search || planType
                ? "Farklı filtrelerle tekrar deneyin."
                : "İlk planınızı oluşturarak başlayın.",
            children: !search && !planType && (
              <Button
                size="sm"
                onClick={() => router.push("/membership-plans/create")}
              >
                <Plus className="h-4 w-4" />
                Yeni Plan Oluştur
              </Button>
            ),
          }}
        />
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Planı Sil"
      >
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{deleteTarget?.name}</span> planını
          silmek istediğinize emin misiniz?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
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
