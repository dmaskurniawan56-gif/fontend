"use client";

import React from "react";
import { TemplateCategory } from "../types/template.types";
import {
  Star,
  Flame,
  Info,
  Bell,
  CalendarCheck,
  MessageSquareReply,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = currentCategory === cat.id;
          return (
            <Button
              key={cat.id}
              type="button"
              variant={isActive ? "default" : "secondary"}
              size="sm"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "h-8 gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer",
                isActive
                  ? "shadow-xs"
                  : "text-foreground-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className="ml-0.5 h-4 px-1.5 text-[10px]"
                >
                  {cat.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Right Side: Search & Favorite Filter */}
      <div className="flex items-center gap-2">
        <div className="w-full sm:w-64">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            onSearch={onSearchChange}
            onClear={() => onSearchChange("")}
            placeholder="Cari template..."
            className="h-8 text-xs rounded-xl"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleFavoriteOnly}
          className={cn(
            "h-8 gap-1.5 rounded-xl px-3 text-xs font-semibold cursor-pointer",
            favoriteOnly && "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
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
        </Button>
      </div>
    </div>
  );
}
