"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { isSeller, isAdmin } from "@/modules/iam/types/auth.types";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";

interface SellerRouteGuardProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function SellerRouteGuard({
  children,
  fallbackTitle,
  fallbackDescription,
}: SellerRouteGuardProps) {
  // Fine-grained atomic selector: only listen to 'role' changes.
  // Prevents unnecessary re-renders when background /auth/profile updates balance, name, etc.
  const userRole = useAuth((s) => s.user?.role);
  const { t } = useI18n();

  // 1. Client hydration synchronization to avoid premature evaluation on F5 reload
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 2. Neutral skeleton placeholder during initial client hydration tick (<30ms)
  // Eliminates the red 'Akses Terbatas' flicker without exposing sensitive UI
  if (!isHydrated) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full animate-pulse">
        <div className="h-8 w-64 bg-muted/60 rounded-xl" />
        <div className="h-4 w-96 bg-muted/40 rounded-lg -mt-3" />
        <div className="h-36 w-full bg-muted/30 rounded-2xl border border-border/40" />
        <div className="h-64 w-full bg-muted/20 rounded-2xl border border-border/30" />
      </div>
    );
  }

  // 3. Authenticated role evaluation only after verified hydration
  const hasAccess = isSeller(userRole) || isAdmin(userRole);

  if (!hasAccess) {
    const title =
      fallbackTitle || "Akses Terbatas: Khusus Pemilik Bisnis (Seller)";
    const description =
      fallbackDescription ||
      "Halaman ini memuat pengaturan sensitif yang hanya dapat dikelola oleh Akun Pemilik Bisnis (Seller). Staf agen CS/Operator tidak memiliki izin untuk mengakses menu ini.";

    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
        <div className="bg-surface border-border w-full max-w-md space-y-5 rounded-3xl border p-6 text-center shadow-lg sm:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="size-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-foreground text-lg font-bold sm:text-xl">
              {title}
            </h2>
            <p className="text-foreground-secondary text-xs leading-relaxed sm:text-sm">
              {description}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="sm"
                className="bg-wise-green text-dark-green hover:bg-wise-green/90 h-10 w-full rounded-full px-5 text-xs font-bold"
              >
                <LayoutDashboard className="mr-2 size-4" />
                {t("common.backToDashboard") || "Kembali ke Dasbor"}
              </Button>
            </Link>
            <Link href="/contacts" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:border-foreground-muted h-10 w-full rounded-full px-5 text-xs font-bold"
              >
                <ArrowLeft className="mr-2 size-4" />
                {t("common.contactBook") || "Buku Kontak"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
