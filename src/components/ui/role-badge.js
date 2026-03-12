import Badge from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/permissions";

const ROLE_VARIANTS = {
  owner: "info",
  admin: "warning",
  staff: "default",
};

export default function RoleBadge({ role }) {
  return (
    <Badge variant={ROLE_VARIANTS[role] || "default"}>
      {ROLE_LABELS[role] || role}
    </Badge>
  );
}
