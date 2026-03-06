"use client";

import { getApiBaseUrl, isProductionApiTarget } from "@/lib/shared/api";

export function ApiTargetBanner() {
  if (!isProductionApiTarget()) {
    return null;
  }

  return (
    <div className="border-b border-amber-300 bg-amber-100/95 px-4 py-2 text-center text-[11px] font-semibold tracking-[0.04em] text-amber-950 dark:border-amber-700 dark:bg-amber-900/60 dark:text-amber-100">
      PROD API connected: {getApiBaseUrl()}
    </div>
  );
}
