"use client";

import { getBackendApiBaseUrl, isProductionApiTarget } from "@/lib/shared/api";

export function ApiTargetBanner() {
  const shouldShowBanner = process.env.NEXT_PUBLIC_SHOW_API_BANNER === "true";

  if (!shouldShowBanner || !isProductionApiTarget()) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 flex h-8 items-center justify-center border-b border-amber-300 bg-amber-100/95 px-4 text-center text-[11px] font-semibold tracking-[0.04em] text-amber-950 dark:border-amber-700 dark:bg-amber-900/60 dark:text-amber-100">
      PROD API connected: {getBackendApiBaseUrl()}
    </div>
  );
}
