"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle({ className }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn(
          "p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-black/50",
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "p-2 rounded-lg border transition-all duration-300",
        "border-neutral-300 bg-white/80 text-neutral-700 hover:bg-neutral-100",
        "dark:border-neutral-700 dark:bg-white/10 dark:text-neutral-200 dark:hover:bg-white/20",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
