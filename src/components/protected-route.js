"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { hasPermission } from "@/lib/permissions";
import Spinner from "@/components/ui/spinner";

export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      // Redirect to onboarding if explicitly not completed (new registrations)
      if (
        user.Studio?.settings?.onboarding_completed === false &&
        pathname !== "/onboarding"
      ) {
        router.push("/onboarding");
        return;
      }

      const hasAccess = roles
        ? roles.includes(user.role)
        : hasPermission(user.role, pathname);

      if (!hasAccess) {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, roles, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user) {
    const hasAccess = roles
      ? roles.includes(user.role)
      : hasPermission(user.role, pathname);

    if (!hasAccess) {
      return null;
    }
  }

  return children;
}
