"use client";

import React, { useState } from "react";
import { EndpointDoc } from "./types";
import { DocsBreadcrumbs } from "./DocsBreadcrumbs";
import { DocsParametersTable } from "./DocsParametersTable";
import { DocsCodeTabs } from "./DocsCodeTabs";
import { DocsResponseView } from "./DocsResponseView";
import { getApiHost } from "./data";
import {
  Lock,
  Copy,
  Check,
  Info,
} from "lucide-react";

interface DocsEndpointViewProps {
  doc: EndpointDoc;
}

export function DocsEndpointView({ doc }: DocsEndpointViewProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const apiHost = getApiHost();

  const fullUrl = `${apiHost}${doc.path}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(false);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500 text-white shadow-xs";
      case "POST":
        return "bg-blue-600 text-white shadow-xs";
      case "DELETE":
        return "bg-rose-600 text-white shadow-xs";
      case "PUT":
      case "PATCH":
        return "bg-amber-600 text-white shadow-xs";
      default:
        return "bg-muted text-foreground";
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

      {/* 2. Header Section */}
      <div className="space-y-3" id="overview">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`font-mono text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${getMethodBadge(
              doc.method
            )}`}
          >
            {doc.method}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {doc.title}
          </h1>
          {doc.badge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30">
              {doc.badge}
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-3xl">
          {doc.description}
        </p>
      </div>

      {/* 3. Information Notice (Clean, non-gimmick) */}
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

      {/* 4. Endpoint Box */}
      <div className="space-y-3" id="endpoint">
        <h3 className="text-base font-bold text-foreground">
          HTTP Endpoint
        </h3>

        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center gap-3 font-mono text-xs overflow-x-auto min-w-0">
            <span
              className={`font-bold px-2 py-0.5 rounded uppercase shrink-0 ${getMethodBadge(
                doc.method
              )}`}
            >
              {doc.method}
            </span>
            <span className="text-muted-foreground shrink-0 select-none">
              {apiHost}
            </span>
            <span className="font-semibold text-foreground truncate">
              {doc.path}
            </span>
          </div>

          <button
            onClick={handleCopyUrl}
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Copy URL"
          >
            {copiedUrl ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. Authentication & Headers Card */}
      <div className="space-y-3" id="authentication">
        <h3 className="text-base font-bold text-foreground">
          Authentication
        </h3>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-emerald-500 shrink-0" />
            <span>
              This endpoint requires Bearer authentication via your secret API Key.
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/80 bg-muted/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase font-bold text-[10px]">
                  <th className="py-2 px-3">Header Key</th>
                  <th className="py-2 px-3">Value</th>
                  <th className="py-2 px-3">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {doc.headers && doc.headers.length > 0 ? (
                  doc.headers.map((header) => (
                    <tr key={header.key}>
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        {header.key}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {header.value}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {header.required ? "Required" : "Optional"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        Authorization
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        Bearer &lt;your_api_key&gt;
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Required
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        Content-Type
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        application/json
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Required
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Parameters Table */}
      <div id="parameters">
        <DocsParametersTable parameters={doc.parameters} />
      </div>

      {/* 7. Code Examples */}
      <div id="code-examples">
        <DocsCodeTabs snippets={doc.snippets} />
      </div>

      {/* 8. Responses */}
      <div id="responses">
        <DocsResponseView responses={doc.responses} />
      </div>

      {/* 9. Error Handling Matrix */}
      {doc.errorMatrix && doc.errorMatrix.length > 0 && (
        <div className="space-y-3" id="errors">
          <h3 className="text-base font-bold text-foreground">
            Error Codes & Troubleshooting
          </h3>

          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-4 min-w-22.5">Status</th>
                  <th className="py-2.5 px-3 min-w-35">Error Code</th>
                  <th className="py-2.5 px-4 min-w-55">Description</th>
                  <th className="py-2.5 px-4 min-w-60">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {doc.errorMatrix.map((err) => (
                  <tr
                    key={err.error}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-rose-500">
                      {err.code}
                    </td>
                    <td className="py-3 px-3">
                      <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold">
                        {err.error}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      {err.description}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {err.solution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
