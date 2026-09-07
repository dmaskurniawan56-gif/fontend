"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavSection, HttpMethod } from "./types";
import {
  BookOpen,
  Smartphone,
  MessageSquare,
  Users,
  Megaphone,
  ChevronDown,
} from "lucide-react";

interface DocsSidebarProps {
  sections: NavSection[];
  onItemClick?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Smartphone,
  MessageSquare,
  Users,
  Megaphone,
};

export function DocsSidebar({ sections, onItemClick }: DocsSidebarProps) {
  const pathname = usePathname();

  const getMethodBadge = (method?: HttpMethod) => {
    if (!method) return null;
    switch (method) {
      case "GET":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
            GET
          </span>
        );
      case "POST":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0">
            POST
          </span>
        );
      case "DELETE":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 shrink-0">
            DEL
          </span>
        );
      case "PUT":
      case "PATCH":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
            PUT
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-full space-y-6 text-sm">
      {sections.map((section) => {
        const IconComponent = section.icon ? ICON_MAP[section.icon] : null;

        return (
          <div key={section.id} className="space-y-2">
            {/* Section Header */}
            <div className="flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              {IconComponent && <IconComponent className="size-3.5 text-wise-green" />}
              <span>{section.title}</span>
            </div>

            {/* Section Items */}
            <ul className="space-y-0.5 border-l border-border/60 ml-4 pl-2">
              {section.items.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      onClick={onItemClick}
                      className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-wise-green/15 text-foreground font-semibold border-l-2 border-wise-green -ml-[9px] pl-[7px]"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {getMethodBadge(item.method)}
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-secondary text-secondary-foreground border border-border">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}
