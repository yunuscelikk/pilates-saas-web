"use client";

import { useAuth } from "@/hooks/useAuth";

export default function PermissionGuard({ roles, children, fallback = null }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return fallback;
  }

  return children;
}
