"use client";

import { use } from "react";
import { CustomerAuthProvider } from "@/components/customer/customer-auth-provider";
import CustomerHeader from "@/components/customer/customer-header";
import CustomerNav from "@/components/customer/customer-nav";
import { useStudioBySlug } from "@/hooks/public/usePublicStudio";

export default function StudioBookLayout({ children, params }) {
  const { studioSlug } = use(params);

  const { data: studioData } = useStudioBySlug(studioSlug);
  const studio = studioData?.data;

  return (
    <CustomerAuthProvider studioSlug={studioSlug}>
      <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-white shadow-sm">
        <CustomerHeader studioName={studio?.name} studioSlug={studioSlug} />
        <main className="flex-1 px-4 pb-20 pt-4">{children}</main>
        <CustomerNav studioSlug={studioSlug} />
      </div>
    </CustomerAuthProvider>
  );
}
