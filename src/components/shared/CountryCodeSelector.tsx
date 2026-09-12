"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Globe } from "lucide-react";
import {
  COUNTRIES,
  CountryCodeItem,
  DEFAULT_COUNTRY,
} from "@/lib/countryCodes";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export interface CountryCodeSelectorProps {
  selectedCountry?: CountryCodeItem;
  onSelectCountry: (country: CountryCodeItem) => void;
  disabled?: boolean;
  variant?: "pill" | "rounded";
  className?: string;
}

export function CountryCodeSelector({
  selectedCountry = DEFAULT_COUNTRY,
  onSelectCountry,
  disabled = false,
  variant = "pill",
  className,
}: CountryCodeSelectorProps) {
  const { t, locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus({ preventScroll: true });
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filter countries based on query (name, localized name, dial code, ISO code)
  const filteredCountries = COUNTRIES.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim().replace(/^\+/, "");
    return (
      c.name.toLowerCase().includes(q) ||
      c.nameId.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (country: CountryCodeItem) => {
    onSelectCountry(country);
    setIsOpen(false);
  };

  const roundedClass =
    variant === "pill" ? "rounded-l-full pl-4 pr-3" : "rounded-l-xl px-3";

  return (
    <div ref={dropdownRef} className="relative inline-block text-left h-full">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex h-full items-center gap-1.5 border-r border-border text-xs sm:text-sm font-bold transition select-none cursor-pointer",
          "bg-muted/40 text-foreground hover:bg-muted/70 active:bg-muted",
          roundedClass,
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "bg-muted text-foreground",
          className,
        )}
        aria-label={t("whatsapp.messagesSelectCountry") || "Pilih kode negara"}
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none select-none">
          {selectedCountry.flag}
        </span>
        <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
          +{selectedCountry.dialCode}
        </span>
        <ChevronDown
          className={cn(
            "size-3 text-foreground-secondary transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl ring-1 ring-black/5 animate-fadeIn">
          {/* Search Header */}
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3.5 top-2.5 size-3.5 text-foreground-secondary pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                t("whatsapp.messagesSearchCountry") ||
                "Cari negara atau kode..."
              }
              className="h-9 w-full rounded-xl border border-border bg-surface pl-8 pr-3 text-xs text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-wise-green"
            />
          </div>

          {/* Scrollable Country List */}
          <div className="max-h-60 overflow-y-auto overscroll-contain space-y-0.5 pr-1 scrollbar-thin">
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-xs text-foreground-secondary">
                <Globe className="size-6 mx-auto mb-1.5 opacity-40 text-foreground-secondary" />
                <p>
                  {t("whatsapp.messagesNoCountryFound") ||
                    "Tidak ditemukan negara"}
                </p>
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                const displayName = locale === "id" ? c.nameId : c.name;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition cursor-pointer select-none",
                      isSelected
                        ? "bg-wise-green/15 text-dark-green dark:text-wise-green font-bold"
                        : "hover:bg-muted text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-base leading-none shrink-0">
                        {c.flag}
                      </span>
                      <span className="truncate font-medium">
                        {displayName}
                      </span>
                      <span className="text-[10px] text-foreground-secondary uppercase tracking-wider shrink-0 font-semibold">
                        ({c.code})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-xs font-semibold text-foreground-secondary">
                        +{c.dialCode}
                      </span>
                      {isSelected && (
                        <Check className="size-3.5 text-emerald-600 dark:text-wise-green shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
