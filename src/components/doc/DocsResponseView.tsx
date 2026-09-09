"use client";

import React, { useState } from "react";
import { ResponseDoc } from "./types";
import { Copy, Check } from "lucide-react";

interface DocsResponseViewProps {
  responses: ResponseDoc[];
  title?: string;
}

export function DocsResponseView({
  responses,
  title = "Response Formats",
}: DocsResponseViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<number>(
    responses[0]?.status || 200,
  );
  const [copied, setCopied] = useState(false);

  if (!responses || responses.length === 0) {
    return null;
  }

  const activeResponse =
    responses.find((r) => r.status === selectedStatus) || responses[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeResponse.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const getStatusBadgeStyle = (status: number, isActive: boolean) => {
    const is2xx = status >= 200 && status < 300;
    const is4xx = status >= 400 && status < 500;

    if (isActive) {
      if (is2xx)
        return "bg-emerald-500 text-white font-bold shadow-xs border-emerald-600";
      if (is4xx)
        return "bg-amber-500 text-white font-bold shadow-xs border-amber-600";
      return "bg-rose-500 text-white font-bold shadow-xs border-rose-600";
    }

    if (is2xx)
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
    if (is4xx)
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20";
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20";
  };

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-base font-bold text-foreground">{title}</h3>
      )}

      {/* Response Status Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {responses.map((resp) => {
          const isActive = resp.status === activeResponse.status;
          return (
            <button
              key={resp.status}
              onClick={() => setSelectedStatus(resp.status)}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${getStatusBadgeStyle(
                resp.status,
                isActive,
              )}`}
            >
              <span className="font-bold">{resp.status}</span> {resp.statusText}
            </button>
          );
        })}
      </div>

      {/* Description */}
      {activeResponse.description && (
        <p className="text-xs text-muted-foreground italic">
          {activeResponse.description}
        </p>
      )}

      {/* Response JSON Viewport */}
      <div className="rounded-xl border border-border bg-[#0d1117] text-[#e6edf3] shadow-md overflow-hidden dark:border-border/80">
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 text-xs">
          <span className="font-mono text-[11px] text-[#8b949e]">
            application/json • {activeResponse.status}{" "}
            {activeResponse.statusText}
          </span>
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 overflow-x-auto max-h-105 scrollbar-thin">
          <pre className="font-mono text-xs leading-relaxed text-[#c9d1d9] selection:bg-wise-green/30 selection:text-white">
            <code>{activeResponse.json}</code>
          </pre>
        </div>
      </div>

      {/* Response Attributes Breakdown Table */}
      {activeResponse.attributes && activeResponse.attributes.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Response Attributes Breakdown
          </h4>

          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-4 min-w-45">Attribute</th>
                  <th className="py-2.5 px-3 min-w-22.5">Type</th>
                  <th className="py-2.5 px-4 min-w-65">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs text-foreground">
                {activeResponse.attributes.map((attr) => (
                  <tr
                    key={attr.name}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-2.5 px-4 align-top">
                      <code className="font-mono font-semibold text-xs px-1.5 py-0.5 rounded bg-muted/70 text-foreground border border-border/50">
                        {attr.name}
                      </code>
                    </td>
                    <td className="py-2.5 px-3 align-top font-mono text-muted-foreground">
                      {attr.type}
                    </td>
                    <td className="py-2.5 px-4 align-top text-foreground-secondary leading-relaxed">
                      {attr.description}
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
