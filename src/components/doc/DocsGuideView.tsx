"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GuideDoc } from "./types";
import { DocsBreadcrumbs } from "./DocsBreadcrumbs";
import { getApiBaseUrl, getApiHost } from "./data";
import {
  Copy,
  Check,
  Terminal,
  Info,
  AlertTriangle,
  CheckCircle2,
  Key,
  Send,
  Smartphone,
  ArrowRight,
} from "lucide-react";

interface DocsGuideViewProps {
  doc: GuideDoc;
}

export function DocsGuideView({ doc }: DocsGuideViewProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const apiBaseUrl = getApiBaseUrl();
  const apiHost = getApiHost();

  const interpolateEnv = (text: string) =>
    text
      .replaceAll("https://api.wahide.com/api/v1", apiBaseUrl)
      .replaceAll("https://api.wahide.com", apiHost);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(interpolateEnv(text));
      setCopiedSection(id);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      setCopiedSection(null);
    }
  };

  const getCalloutStyles = (type: string) => {
    switch (type) {
      case "warning":
        return {
          container: "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10",
          icon: <AlertTriangle className="size-4 text-amber-500 shrink-0" />,
          title: "text-amber-700 dark:text-amber-400",
        };
      case "success":
      case "tip":
        return {
          container: "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10",
          icon: <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />,
          title: "text-emerald-700 dark:text-emerald-400",
        };
      case "info":
      default:
        return {
          container: "border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10",
          icon: <Info className="size-4 text-blue-500 shrink-0" />,
          title: "text-blue-700 dark:text-blue-400",
        };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Breadcrumbs */}
      <DocsBreadcrumbs
        category={doc.category}
        categorySlug={doc.categorySlug}
        title={doc.title}
      />

      {/* 2. Header */}
      <div className="space-y-2 border-b border-border/60 pb-6" id="overview">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {doc.title}
        </h1>
        <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-3xl">
          {doc.description}
        </p>
      </div>

      {/* 3. Banner Notice (Clean, non-gimmick) */}
      {doc.bannerNotice && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <Info className="size-4 text-emerald-600 dark:text-wise-green shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">
                {doc.bannerNotice.title}
              </h4>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {doc.bannerNotice.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sections */}
      <div className="space-y-10">
        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight border-b border-border/40 pb-2">
              {section.title}
            </h2>

            {/* Content prose */}
            <div className="text-xs sm:text-sm text-foreground-secondary leading-relaxed whitespace-pre-line space-y-2">
              {section.content}
            </div>

            {/* Callout Box */}
            {section.callout && (
              <div
                className={`rounded-xl border p-4 shadow-xs ${
                  getCalloutStyles(section.callout.type).container
                }`}
              >
                <div className="flex items-start gap-3">
                  {getCalloutStyles(section.callout.type).icon}
                  <div className="space-y-1 text-xs">
                    <h5
                      className={`font-semibold ${
                        getCalloutStyles(section.callout.type).title
                      }`}
                    >
                      {section.callout.title}
                    </h5>
                    <div className="text-foreground-secondary leading-relaxed whitespace-pre-line">
                      {interpolateEnv(section.callout.content)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Code Snippet Box */}
            {section.code && (
              <div className="rounded-xl border border-border bg-[#0d1117] text-[#e6edf3] shadow-xs overflow-hidden dark:border-border/80">
                <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#8b949e]">
                    <Terminal className="size-3 text-[#58a6ff]" />
                    <span>{section.code.title || section.code.language}</span>
                  </div>

                  <button
                    onClick={() =>
                      section.code &&
                      handleCopy(section.id, section.code.content)
                    }
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                  >
                    {copiedSection === section.id ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 overflow-x-auto">
                  <pre className="font-mono text-xs leading-relaxed text-[#c9d1d9] selection:bg-wise-green/30 selection:text-white">
                    <code>{interpolateEnv(section.code.content)}</code>
                  </pre>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* 5. Next Steps Navigation Grid (Developer-First) */}
      <div className="pt-8 border-t border-border/60 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Next Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/docs/authentication"
            className="group p-4 rounded-xl border border-border bg-card hover:border-emerald-500/50 dark:hover:border-wise-green/50 hover:bg-muted/20 transition-all shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green">
                <Key className="size-4" />
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-wise-green transition-colors">
                Authentication
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Obtain and configure your Bearer API tokens.
              </p>
            </div>
          </Link>

          <Link
            href="/docs/messaging/send-text"
            className="group p-4 rounded-xl border border-border bg-card hover:border-blue-500/50 hover:bg-muted/20 transition-all shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Send className="size-4" />
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Send Messages
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Dispatch text, media, and dynamic spintax messages.
              </p>
            </div>
          </Link>

          <Link
            href="/docs/devices/list"
            className="group p-4 rounded-xl border border-border bg-card hover:border-purple-500/50 hover:bg-muted/20 transition-all shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Smartphone className="size-4" />
              </div>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Device Management
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Pair and maintain WhatsApp device sessions.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
