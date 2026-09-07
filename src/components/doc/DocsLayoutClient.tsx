"use client";

import React, { useState } from "react";
import { docNavigation } from "./data";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";
import { DocsMobileDrawer } from "./DocsMobileDrawer";

interface DocsLayoutClientProps {
  children: React.ReactNode;
}

export function DocsLayoutClient({ children }: DocsLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-wise-green/20">
      {/* 1. Top Navbar */}
      <DocsHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* 2. Mobile Drawer Navigation */}
      <DocsMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sections={docNavigation}
      />

      {/* 3. Main 3-Column Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        <div className="flex items-start gap-8 py-8">
          {/* Left Desktop Sidebar (Fixed width, independent sticky scroll) */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-4 scrollbar-thin">
            <DocsSidebar sections={docNavigation} />
          </aside>

          {/* Center Main Viewport */}
          <main className="flex-1 min-w-0 max-w-4xl">{children}</main>
        </div>
      </div>
    </div>
  );
}
