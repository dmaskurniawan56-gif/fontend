"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchDocs } from "./data";
import { DocItem, HttpMethod } from "./types";
import { Search, X, CornerDownLeft, FileText } from "lucide-react";

interface DocsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsSearchModal({ isOpen, onClose }: DocsSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocItem[]>([]);
  const router = useRouter();

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchDocs(query));
    } else {
      setResults([]);
    }
  }, [query]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    router.push(`/docs/${slug}`);
    onClose();
    setQuery("");
  };

  const getMethodBadge = (method?: HttpMethod) => {
    if (!method) return null;
    switch (method) {
      case "GET":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
            GET
          </span>
        );
      case "POST":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-800 dark:text-blue-300">
            POST
          </span>
        );
      case "DELETE":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-800 dark:text-rose-300">
            DEL
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/60">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoints, parameters, guides..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              type="button"
              className="p-1 rounded text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-muted rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/40">
          {query.trim() === "" ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Type keywords to search across all Wahide REST API documentation.
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No documentation found for &ldquo;
              <span className="text-foreground font-medium">{query}</span>
              &rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.slug)}
                type="button"
                className="w-full text-left p-3 rounded-xl hover:bg-muted/40 transition-colors flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.type === "endpoint" ? (
                      getMethodBadge(item.method)
                    ) : (
                      <FileText className="size-3.5 text-emerald-800 dark:text-wise-green shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-foreground group-hover:text-emerald-800 dark:group-hover:text-wise-green transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.2 rounded bg-muted/60">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {item.type === "endpoint" ? item.path : item.description}
                  </p>
                </div>

                <CornerDownLeft className="size-3 text-muted-foreground/40 group-hover:text-foreground shrink-0 mt-1 transition-colors" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Search Wahide API Documentation</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
