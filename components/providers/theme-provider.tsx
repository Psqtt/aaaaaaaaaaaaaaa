"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const applyAppearance = () => {
        const root = document.documentElement;
        const accent = localStorage.getItem("nexus_accent_color") || "indigo";
        root.setAttribute("data-accent", accent);

        const pattern = localStorage.getItem("nexus_bg_pattern") || "plain";
        root.setAttribute("data-pattern", pattern);

        const radius = localStorage.getItem("nexus_border_radius") || "subtle";
        root.setAttribute("data-radius", radius);

        const darkVariant = localStorage.getItem("nexus_dark_variant") || "graphite";
        root.setAttribute("data-dark-variant", darkVariant);

        const glass = localStorage.getItem("nexus_glassmorphism") || "false";
        root.setAttribute("data-glass", glass);
      };

      applyAppearance();
      window.addEventListener("storage", applyAppearance);
      return () => window.removeEventListener("storage", applyAppearance);
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
