"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n/context";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Suppress React 19 / Next.js 16 development false-positive warning for next-themes inline theme script
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    const isScriptTagWarning = args.some(
      (arg) =>
        (typeof arg === "string" && arg.includes("Encountered a script tag")) ||
        (arg instanceof Error &&
          arg.message.includes("Encountered a script tag")),
    );
    if (isScriptTagWarning) {
      return;
    }
    origError.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <TooltipProvider delay={200}>{children}</TooltipProvider>
        <Toaster />
      </I18nProvider>
    </NextThemesProvider>
  );
}
