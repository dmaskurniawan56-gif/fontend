"use client";

import React, { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}

interface DocsTableOfContentsProps {
  items?: TocItem[];
}

const DEFAULT_ENDPOINT_TOC: TocItem[] = [
  { id: "overview", title: "Overview" },
  { id: "endpoint", title: "HTTP Endpoint" },
  { id: "authentication", title: "Authentication" },
  { id: "parameters", title: "Request Parameters" },
  { id: "code-examples", title: "Code Examples" },
  { id: "responses", title: "Response Formats" },
  { id: "errors", title: "Error Handling" },
];

export function DocsTableOfContents({
  items = DEFAULT_ENDPOINT_TOC,
}: DocsTableOfContentsProps) {
  // Deduplicate items by ID to prevent duplicate key or observer issues
  const uniqueItems = React.useMemo(() => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [items]);

  const [activeId, setActiveId] = useState<string>(uniqueItems[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0,
      }
    );

    uniqueItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [uniqueItems]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  if (!uniqueItems || uniqueItems.length === 0) return null;

  return (
    <div className="space-y-3 text-xs sticky top-24">
      <div className="font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
        On this page
      </div>

      <ul className="space-y-1 border-l border-border/80 pl-3">
        {uniqueItems.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li key={`${item.id}-${idx}`}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`text-left block py-1 transition-colors w-full truncate ${
                  isActive
                    ? "text-wise-green font-semibold border-l-2 border-wise-green -ml-[13px] pl-[11px]"
                    : "text-muted-foreground hover:text-foreground"
                } ${item.level === 3 ? "pl-3 text-[11px]" : ""}`}
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
