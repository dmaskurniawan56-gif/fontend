"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DocsSearchModal } from "./DocsSearchModal";
import { Search, Menu, ExternalLink } from "lucide-react";

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

interface DocsHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch?: () => void;
}

export function DocsHeader({
  onOpenMobileMenu,
  onOpenSearch,
}: DocsHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleTriggerSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3.5 sm:h-16 sm:gap-4 sm:px-6">
          {/* Brand & Mobile Hamburger */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenMobileMenu}
              type="button"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted/50 hover:text-foreground active:scale-95 lg:hidden"
              aria-label="Open documentation sidebar menu"
            >
              <Menu className="size-5" />
            </button>

            <Link href="/" className="group flex shrink-0 items-center gap-2">
              <span className="bg-wise-green size-3.5 rounded-full shadow-xs transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-base font-black tracking-tight sm:text-lg">
                  Wahide
                </span>
                <span className="rounded-md border border-wise-green/30 bg-wise-green/15 px-1.5 py-0.5 text-[10px] font-bold text-dark-green sm:text-xs dark:text-wise-green">
                  API Docs
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Search Bar (Ctrl+K / Cmd+K trigger) - Tablet & Desktop */}
          <div className="hidden max-w-md flex-1 sm:block">
            <button
              onClick={handleTriggerSearch}
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground shadow-xs transition hover:bg-muted/70"
            >
              <div className="flex items-center gap-2">
                <Search className="text-muted-foreground size-3.5" />
                <span>Search documentation...</span>
              </div>
              <kbd className="bg-background text-muted-foreground inline-flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Action Links & Controls */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            {/* Mobile Search Button */}
            <button
              onClick={handleTriggerSearch}
              type="button"
              className="flex size-9 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted/50 hover:text-foreground active:scale-95 sm:hidden"
              aria-label="Search docs"
            >
              <Search className="size-4" />
            </button>

            <Link
              href="https://github.com/hidessh99/wahide-api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition hover:bg-muted/40 md:flex"
            >
              <GithubIcon className="size-4" />
              <span>GitHub</span>
              <ExternalLink className="text-muted-foreground/60 size-3" />
            </Link>

            {/* Option 1: Dashboard link hidden on mobile header, placed in Mobile Drawer Menu */}
            <Link
              href="/dashboard"
              className="border-border/80 hover:border-emerald-500/50 dark:hover:border-wise-green/50 text-foreground hover:text-emerald-800 dark:hover:text-wise-green hidden items-center rounded-lg border px-3 py-1.5 text-xs font-bold transition sm:inline-flex"
            >
              Dashboard
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {!onOpenSearch && (
        <DocsSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}
