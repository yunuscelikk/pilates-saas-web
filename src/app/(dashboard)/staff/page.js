"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStaff, useStaffStats, useDeleteStaff } from "@/hooks/useStaff";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/permissions";
import DataTable, { getSelectionColumn } from "@/components/ui/data-table";
import DataTableToolbar from "@/components/ui/data-table-toolbar";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import RoleBadge from "@/components/ui/role-badge";
import Modal from "@/components/ui/modal";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import RowPreviewPanel, {
  PreviewField,
} from "@/components/ui/row-preview-panel";
import {
  Plus,
  Pencil,
  Trash2,
  UserCog,
  Users,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const ROLE_LABELS = {
  owner: "Sahip",
  admin: "Yönetici",
  staff: "Personel",
};

export default function StaffPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, staff: null });
  const [rowSelection, setRowSelection] = useState({});
  const [previewStaff, setPreviewStaff] = useState(null);

  const { data, isLoading, isError, error } = useStaff({
    page,
    search: search || undefined,
    role: roleFilter || undefined,
  });

  const { data: statsData, isLoading: statsLoading } = useStaffStats();
  const deleteMutation = useDeleteStaff();

  const staffList = data?.data || [];
  const meta = data?.meta;
  const stats = statsData?.data;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleDelete = async () => {
    if (!deleteModal.staff) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.staff.id);
      setDeleteModal({ open: false, staff: null });
      toast.success("Personel başarıyla silindi.");
    } catch {
      toast.error("Personel silinirken hata oluştu.");
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
      toast.success(`${selectedIds.length} personel başarıyla silindi.`);
    } catch {
      toast.error("Toplu silme sırasında hata oluştu.");
    }
  };

  const columns = useMemo(
    () => [
      getSelectionColumn(),
      {
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        id: "name",
        header: "Ad Soyad",
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer font-medium text-left hover:text-brand transition-colors"
            onClick={() => setPreviewStaff(row.original)}
          >
            {row.original.first_name} {row.original.last_name}
          </button>
        ),
      },
      {
        accessorKey: "email",
        header: "E-posta",
      },
      {
        accessorKey: "role",
        header: "Rol",
        cell: ({ getValue }) => <RoleBadge role={getValue()} />,
        enableSorting: false,
      },
      {
        accessorKey: "is_active",
        header: "Durum",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "success" : "danger"}>
            {getValue() ? "Aktif" : "Pasif"}
          </Badge>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Kayıt Tarihi",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString("tr-TR"),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">İşlemler</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link href={`/staff/${row.original.id}`}>
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            {row.original.role !== ROLES.OWNER && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDeleteModal({ open: true, staff: row.original })
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
    [],
  );

  const selectedCount = Object.keys(rowSelection).length;

  if (user?.role !== ROLES.OWNER) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Personel Yönetimi">
        <Link href="/staff/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Personel
          </Button>
        </Link>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          name="Toplam Personel"
          value={stats?.totalStaff}
          icon={Users}
          color="bg-brand-light text-brand"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Aktif Personel"
          value={stats?.activeStaff}
          icon={UserCheck}
          color="bg-emerald-100 text-emerald-600"
          isLoading={statsLoading}
        />
        <StatsCard
          name="Yönetici Sayısı"
          value={stats?.adminCount}
          icon={ShieldCheck}
          color="bg-blue-100 text-blue-600"
          isLoading={statsLoading}
        />
      </div>

      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Ad, soyad veya e-posta ara..."
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
        bulkActions={
          <Button variant="danger" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="h-4 w-4" />
            Seçilenleri Sil
          </Button>
        }
        filters={
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Tüm Roller</option>
            <option value="admin">Yönetici</option>
            <option value="staff">Personel</option>
            <option value="owner">Sahip</option>
          </select>
        }
      />

      {isError ? (
        <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-700">
          {error?.response?.data?.message ||
            "Personel yüklenirken hata oluştu."}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={staffList}
          meta={meta}
          onPageChange={setPage}
          isLoading={isLoading}
          enableRowSelection
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => String(row.id)}
          emptyState={{
            icon: UserCog,
            title:
              search || roleFilter
                ? "Personel bulunamadı"
                : "Henüz personel eklenmemiş",
            description:
              search || roleFilter
                ? "Farklı filtrelerle tekrar deneyin."
                : "İlk personelinizi ekleyerek başlayın.",
            children: !search && !roleFilter && (
              <Link href="/staff/create">
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Yeni Personel Ekle
                </Button>
              </Link>
            ),
          }}
        />
      )}

      {/* Row Preview Panel */}
      <RowPreviewPanel
        open={!!previewStaff}
        onOpenChange={(open) => !open && setPreviewStaff(null)}
        title="Personel Detayı"
      >
        {previewStaff && (
          <dl className="space-y-3">
            <PreviewField
              label="Ad Soyad"
              value={`${previewStaff.first_name} ${previewStaff.last_name}`}
            />
            <PreviewField label="E-posta" value={previewStaff.email} />
            <PreviewField
              label="Rol"
              value={ROLE_LABELS[previewStaff.role] || previewStaff.role}
            />
            <PreviewField
              label="Durum"
              value={previewStaff.is_active ? "Aktif" : "Pasif"}
            />
            <PreviewField
              label="Kayıt Tarihi"
              value={
                previewStaff.created_at
                  ? new Date(previewStaff.created_at).toLocaleDateString(
                      "tr-TR",
                    )
                  : undefined
              }
            />
            <div className="pt-3 border-t">
              <Link href={`/staff/${previewStaff.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="h-4 w-4" />
                  Düzenle
                </Button>
              </Link>
            </div>
          </dl>
        )}
      </RowPreviewPanel>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, staff: null })}
        title="Personeli Sil"
      >
        <p className="text-sm text-gray-600">
          <strong>
            {deleteModal.staff?.first_name} {deleteModal.staff?.last_name}
          </strong>{" "}
          adlı personeli silmek istediğinize emin misiniz? Bu işlem geri
          alınamaz.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ open: false, staff: null })}
          >
            İptal
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleteMutation.isPending}
          >
            Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
}
