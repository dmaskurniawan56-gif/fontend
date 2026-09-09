import React from "react";
import { ParameterDoc } from "./types";
import { CornerDownRight } from "lucide-react";

interface DocsParametersTableProps {
  parameters: ParameterDoc[];
  title?: string;
  description?: string;
}

export function DocsParametersTable({
  parameters,
  title = "Request Parameters",
  description = "The request body must be formatted as JSON with the following parameters:",
}: DocsParametersTableProps) {
  if (!parameters || parameters.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/40 p-4 text-xs text-muted-foreground">
        No request parameters required for this endpoint.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <div>
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="py-3 px-4 min-w-45">Parameter</th>
              <th className="py-3 px-3 min-w-25">Type</th>
              <th className="py-3 px-3 min-w-27.5">Required</th>
              <th className="py-3 px-4 min-w-70">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 font-normal text-foreground">
            {parameters.map((param) => {
              const isNested =
                (param.depth && param.depth > 0) || Boolean(param.parent);

              return (
                <tr
                  key={param.name}
                  className={`transition-colors hover:bg-muted/20 ${
                    isNested ? "bg-muted/5" : ""
                  }`}
                >
                  {/* Parameter Name */}
                  <td className="py-3 px-4 align-top">
                    <div
                      className={`flex items-center gap-1.5 ${
                        isNested ? "pl-5" : ""
                      }`}
                    >
                      {isNested && (
                        <CornerDownRight className="size-3 text-muted-foreground/60 shrink-0" />
                      )}
                      <code
                        className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                          isNested
                            ? "bg-secondary text-foreground border border-border/60"
                            : "bg-wise-green/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {param.name}
                      </code>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3 align-top">
                    <span className="font-mono text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60 border border-border/40">
                      {param.type}
                    </span>
                  </td>

                  {/* Required Badge */}
                  <td className="py-3 px-3 align-top">
                    {param.required ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                        Optional
                      </span>
                    )}
                  </td>

                  {/* Description & Metadata */}
                  <td className="py-3 px-4 align-top text-xs leading-relaxed text-foreground-secondary">
                    <div className="space-y-1.5">
                      <p>{param.description}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                        {param.defaultValue && (
                          <span className="inline-flex items-center gap-1 font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/40">
                            default:{" "}
                            <span className="text-foreground font-semibold">
                              {param.defaultValue}
                            </span>
                          </span>
                        )}

                        {param.example && (
                          <span className="inline-flex items-center gap-1 font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/40">
                            example:{" "}
                            <span className="text-foreground font-semibold">
                              {param.example}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
