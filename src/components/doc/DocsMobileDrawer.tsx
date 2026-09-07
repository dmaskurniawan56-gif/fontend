"use client";

import React, { useEffect } from "react";
import { NavSection } from "./types";
import { DocsSidebar } from "./DocsSidebar";
import { X } from "lucide-react";

interface DocsMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: NavSection[];
}

export function DocsMobileDrawer({
  isOpen,
  onClose,
  sections,
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
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-background border-r border-border shadow-2xl p-4 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-wise-green shadow-xs" />
              <span className="font-bold text-sm tracking-tight text-foreground">
                Wahide API Docs
              </span>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Close documentation menu"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="py-2">
            <DocsSidebar sections={sections} onItemClick={onClose} />
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-border/80 text-[11px] text-muted-foreground">
          Wahide REST API v1.0 • Meta Cloud Compatible
        </div>
      </div>
    </div>
  );
}
