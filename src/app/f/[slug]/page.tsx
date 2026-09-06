import React from "react";
import Link from "next/link";
import { Lock, ShieldAlert, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akses Publik Dinonaktifkan | Wahide",
  description: "Akses formulir publik telah dinonaktifkan secara permanen.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PublicFormDisabledPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-6 sm:p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <ShieldAlert className="size-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground-muted mb-3 border border-border/60">
          <Lock className="size-3" />
          <span>Privat & Terproteksi</span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-2">
          Akses Publik Dinonaktifkan
        </h1>

        <p className="text-xs text-foreground-muted leading-relaxed sm:text-sm mb-6">
          Untuk menjaga keamanan ekosistem, kepatuhan regulasi, dan mencegah penyalahgunaan platform, akses pengisian formulir melalui tautan web publik telah dinonaktifkan secara permanen. Seluruh formulir Wahide bersifat privat internal.
        </p>

        <div className="rounded-2xl bg-muted/40 p-4 text-left text-xs text-foreground-muted border border-border/50 mb-6 space-y-2">
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <Lock className="size-3.5 text-primary" />
            <span>Informasi Kebijakan Privasi</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Data hanya dapat diinput dan dikelola secara privat oleh pengguna terdaftar melalui dashboard resmi Wahide.
          </p>
        </div>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "primaryPill" }),
            "w-full h-10 text-xs font-bold gap-2 shadow-xs cursor-pointer inline-flex items-center justify-center"
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
