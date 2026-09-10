"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Shield, Webhook } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function WebhookArchitecture() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-4 sm:py-6">
      <div className="rounded-3xl border border-border bg-linear-to-br from-surface to-muted/20 p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Webhook className="size-3.5" />
              <span>{t("landingPages.apiGateway.webhookBadge")}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t("landingPages.apiGateway.webhookTitle")}
            </h3>
            <p className="text-sm font-medium leading-relaxed text-foreground-secondary">
              {t("landingPages.apiGateway.webhookDesc")}
            </p>

            <ul className="space-y-2.5 pt-2 text-xs font-semibold text-foreground-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
                <span>{t("landingPages.apiGateway.webhookF1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
                <span>{t("landingPages.apiGateway.webhookF2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green shrink-0" />
                <span>{t("landingPages.apiGateway.webhookF3")}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            {/* Visual Architecture Box */}
            <div className="rounded-2xl border border-border/80 bg-zinc-950 p-5 font-mono text-xs text-zinc-300 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-emerald-400 font-bold">
                  POST /webhook/whatsapp
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  HTTP/2 200 OK
                </span>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="text-zinc-500">{"// Headers"}</div>
                <div className="text-amber-300">
                  X-Wahide-Event:{" "}
                  <span className="text-zinc-200">message.received</span>
                </div>
                <div className="text-amber-300">
                  X-Wahide-Secret:{" "}
                  <span className="text-zinc-400">e8f4b2c1...sha256</span>
                </div>

                <div className="text-zinc-500 pt-2">{"// JSON Payload"}</div>
                <div className="text-zinc-300 whitespace-pre">
                  {`{
  "event": "message.received",
  "device_id": "01M237H3Z63XCG3D15WJAW8QAM",
  "data": {
    "message_id": "3EB045182939AB10",
    "sender": "6281234567890",
    "message": "Halo, saya ingin tanya paket langganan",
    "timestamp": 1773176508
  }
}`}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Shield className="size-3.5" />{" "}
                  {t("landingPages.apiGateway.webhookVerified")}
                </span>
                <span className="flex items-center gap-1 text-zinc-500">
                  Dispatch time: 45ms <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
