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
}

export function DocsHeader({ onOpenMobileMenu }: DocsHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              type="button"
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              aria-label="Open documentation sidebar menu"
            >
              <Menu className="size-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="h-3.5 w-3.5 rounded-full bg-wise-green shadow-xs transition-transform group-hover:scale-110" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-lg tracking-tight text-foreground">
                  Wahide
                </span>
                <span className="text-xs font-bold px-1.5 py-0.2 rounded-md bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30">
                  API Docs
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Search Bar (Ctrl+K / Cmd+K trigger) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted/70 text-xs text-muted-foreground transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Search className="size-3.5 text-muted-foreground" />
                <span>Search documentation...</span>
              </div>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-background rounded border border-border">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Action Links & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40"
              aria-label="Search docs"
            >
              <Search className="size-4" />
            </button>

            <Link
              href="https://github.com/hidessh99/wahide-api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <GithubIcon className="size-4" />
              <span>GitHub</span>
              <ExternalLink className="size-3 text-muted-foreground/60" />
            </Link>

            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center text-xs font-bold text-foreground hover:text-wise-green px-3 py-1.5 rounded-lg border border-border/80 hover:border-wise-green/50 transition-colors"
            >
              Dashboard
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <DocsSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
