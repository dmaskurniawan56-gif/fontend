"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Sparkles, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

const DEFAULT_TEMPLATE =
  "{Halo|Hai|Selamat Siang} Kak {Budi|Siti|Andi}, kami ada penawaran {spesial|eksklusif|terbatas} khusus untuk pesanan Anda hari ini! Dapatkan diskon hingga {20%|30%|50%}.";

function parseSpintax(text: string, randomize = true): string {
  const spintaxRegex = /\{([^{}]+)\}/g;
  return text.replace(spintaxRegex, (_, options) => {
    const choices = options.split("|");
    if (!randomize) {
      return choices[0] || "";
    }
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  });
}

export function LiveSpintaxPlayground() {
  const { t } = useI18n();
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [seed, setSeed] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const preview = useMemo(() => {
    if (!mounted) {
      return parseSpintax(template, false);
    }
    return parseSpintax(template, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, seed, mounted]);

  const handleRandomize = () => {
    setSeed((prev) => prev + 1);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Sparkles className="size-3.5" />
          <span>Interactive Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {t("landingPages.broadcast.playgroundTitle") ||
            "Uji Coba Spintax Langsung di Browser"}
        </h2>
        <p className="text-foreground-secondary text-sm font-semibold leading-relaxed">
          {t("landingPages.broadcast.playgroundSubtitle") ||
            "Ketik pesan Anda dengan format {opsi1|opsi2} dan klik tombol untuk melihat bagaimana pesan berubah secara acak."}
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm space-y-6">
        {/* Editor Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground block">
            Template Pesan Spintax:
          </label>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-background/60 p-4 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-wise-green leading-relaxed"
            placeholder="Ketik template dengan format {opsi1|opsi2}..."
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            variant="primaryPill"
            onClick={handleRandomize}
            className="gap-2 px-6 font-bold cursor-pointer"
          >
            <RefreshCw className="size-4 animate-spin-once" />
            <span>
              {t("landingPages.broadcast.playgroundButton") || "Acak Ulang Pesan"}
            </span>
          </Button>
        </div>

        {/* WhatsApp Preview Bubble */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-foreground-secondary flex items-center gap-1.5">
            <MessageSquare className="size-3.5 text-wise-green" />
            <span>
              {t("landingPages.broadcast.playgroundResult") ||
                "Hasil Variasi Pesan yang Terkirim ke Pelanggan:"}
            </span>
          </span>

          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5">
            <div className="max-w-md ml-auto rounded-2xl rounded-tr-xs bg-emerald-600 text-white p-4 text-xs sm:text-sm shadow-sm space-y-2 leading-relaxed">
              <p suppressHydrationWarning>{preview}</p>
              <div className="text-[10px] text-emerald-200 text-right font-mono">
                12:45 • Terkirim ✓✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
