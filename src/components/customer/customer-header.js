"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CustomerHeader({ studioName, studioSlug }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/book/${studioSlug}`)}
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-gray-900">
          {studioName || "Loading..."}
        </h1>
      </div>
    </header>
  );
}
