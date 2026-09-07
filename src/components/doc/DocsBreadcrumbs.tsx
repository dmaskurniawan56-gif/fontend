import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface DocsBreadcrumbsProps {
  category: string;
  categorySlug: string;
  title: string;
}

export function DocsBreadcrumbs({ category, categorySlug, title }: DocsBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 select-none overflow-x-auto py-1 scrollbar-none"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
      >
        <Home className="size-3.5" />
        <span>Home</span>
      </Link>
      <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" />
      <Link
        href="/docs/intro"
        className="hover:text-foreground transition-colors shrink-0"
      >
        Docs
      </Link>
      <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" />
      <span className="text-muted-foreground/80 shrink-0">{category}</span>
      <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" />
      <span className="font-semibold text-foreground truncate">{title}</span>
    </nav>
  );
}
