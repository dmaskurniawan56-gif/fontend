"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { NavSection } from "./types";
import { DocsSidebar } from "./DocsSidebar";
import {
  X,
  Search,
  LayoutDashboard,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface DocsMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: NavSection[];
  onOpenSearch?: () => void;
}

export function DocsMobileDrawer({
  isOpen,
  onClose,
  sections,
  onOpenSearch,
}: DocsMobileDrawerProps) {
  // Prevent body scroll when drawer is open
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

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="animate-in fade-in fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="bg-background border-border animate-in slide-in-from-left fixed inset-y-0 left-0 z-10 flex w-4/5 max-w-xs flex-col border-r shadow-2xl duration-200">
        {/* Header */}
        <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <span className="bg-wise-green size-3 rounded-full shadow-xs" />
            <span className="text-foreground text-sm font-bold tracking-tight">
              Wahide API Docs
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="hover:bg-muted/50 text-muted-foreground hover:text-foreground flex size-8 cursor-pointer items-center justify-center rounded-lg transition active:scale-95"
            aria-label="Close documentation menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Quick Search Bar inside Drawer */}
        {onOpenSearch && (
          <div className="border-border shrink-0 border-b p-3">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              type="button"
              className="border-border bg-muted/40 hover:bg-muted/70 text-muted-foreground flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs shadow-xs transition"
            >
              <div className="flex items-center gap-2">
                <Search className="text-muted-foreground size-3.5" />
                <span>Cari endpoint / topik...</span>
              </div>
              <kbd className="bg-background text-muted-foreground inline-flex items-center rounded border border-border px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                Search
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation Items (Scrollable Body) */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <DocsSidebar sections={sections} onItemClick={onClose} />
        </div>

        {/* Option 1: Mobile Drawer Footer with Dashboard button & GitHub link */}
        <div className="border-border bg-surface/50 dark:bg-[#161715]/50 shrink-0 space-y-2.5 border-t p-4">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="bg-wise-green text-dark-green flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black shadow-xs transition hover:scale-[1.02] active:scale-95"
          >
            <LayoutDashboard className="text-dark-green size-4" />
            <span>Buka Dashboard Wahide</span>
            <ArrowRight className="text-dark-green size-3.5" />
          </Link>

          <Link
            href="https://github.com/hidessh99/wahide-api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition"
          >
            <div className="flex items-center gap-2">
              <GithubIcon className="size-3.5" />
              <span>GitHub API Docs</span>
            </div>
            <ExternalLink className="text-muted-foreground/60 size-3" />
          </Link>

          <p className="text-muted-foreground/70 text-center text-[10px] font-medium">
            Wahide REST API v1.0 • Meta Cloud Compatible
          </p>
        </div>
      </div>
    </div>
  );
}
