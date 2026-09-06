"use client";

import React from "react";
import { TemplateCategory } from "../types/template.types";
import {
  Search,
  Star,
  Flame,
  Info,
  Bell,
  CalendarCheck,
  MessageSquareReply,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateFilterBarProps {
  currentCategory: TemplateCategory | "ALL";
  onSelectCategory: (cat: TemplateCategory | "ALL") => void;
  search: string;
  onSearchChange: (search: string) => void;
  favoriteOnly: boolean;
  onToggleFavoriteOnly: () => void;
  stats?: {
    total: number;
    marketing: number;
    utility: number;
    reminder: number;
    reservation: number;
    quickReply: number;
    favorites: number;
  };
}

export function TemplateFilterBar({
  currentCategory,
  onSelectCategory,
  search,
  onSearchChange,
  favoriteOnly,
  onToggleFavoriteOnly,
  stats,
}: TemplateFilterBarProps) {
  const CATEGORIES: Array<{
    id: TemplateCategory | "ALL";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }> = [
    {
      id: "ALL",
      label: "Semua Kategori",
      icon: Layers,
      count: stats?.total,
    },
    {
      id: "MARKETING",
      label: "Marketing",
      icon: Flame,
      count: stats?.marketing,
    },
    {
      id: "UTILITY",
      label: "Operasional",
      icon: Info,
      count: stats?.utility,
    },
    {
      id: "REMINDER",
      label: "Pengingat",
      icon: Bell,
      count: stats?.reminder,
    },
    {
      id: "RESERVATION",
      label: "Reservasi",
      icon: CalendarCheck,
      count: stats?.reservation,
    },
    {
      id: "QUICK_REPLY",
      label: "Balasan Cepat",
      icon: MessageSquareReply,
      count: stats?.quickReply,
    },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface/50 p-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                  : "text-foreground-secondary hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-foreground-muted"
                  )}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Side: Search & Favorite Filter */}
      <div className="flex items-center gap-2">
        <div className="relative min-w-[200px] flex-1 sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari template..."
            className="w-full rounded-xl border border-border/60 bg-background/80 py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-foreground-muted/70 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          onClick={onToggleFavoriteOnly}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
            favoriteOnly
              ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "border-border/60 text-foreground-secondary hover:bg-muted/60 hover:text-foreground"
          )}
          title="Filter hanya template favorit"
        >
          <Star
            className={cn(
              "size-3.5",
              favoriteOnly ? "fill-amber-500 text-amber-500" : "text-foreground-muted"
            )}
          />
          <span className="hidden sm:inline">Favorit</span>
        </button>
      </div>
    </div>
  );
}
