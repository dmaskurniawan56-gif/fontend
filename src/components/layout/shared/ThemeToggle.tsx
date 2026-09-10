"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

function useIsMounted() {
  const subscribe = React.useCallback(() => () => {}, []);
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <Button
        variant="secondaryPill"
        size="sm"
        className={cn(
          "size-9 p-0 opacity-0 sm:size-auto sm:h-9 sm:w-24 sm:px-3",
          className,
        )}
      >
        ...
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="secondaryPill"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "size-9 p-0 text-xs sm:size-auto sm:h-9 sm:gap-2 sm:px-3",
        showLabel === true && "w-auto gap-2 px-3",
        showLabel === false && "size-9 p-0",
        className,
      )}
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <>
          <Sun className="text-wise-green size-4 sm:size-3.5" />
          <span
            className={cn(
              showLabel !== false &&
                (showLabel === true ? "inline" : "hidden sm:inline"),
            )}
          >
            Light
          </span>
        </>
      ) : (
        <>
          <Moon className="text-dark-green size-4 sm:size-3.5" />
          <span
            className={cn(
              showLabel !== false &&
                (showLabel === true ? "inline" : "hidden sm:inline"),
            )}
          >
            Dark
          </span>
        </>
      )}
    </Button>
  );
}
