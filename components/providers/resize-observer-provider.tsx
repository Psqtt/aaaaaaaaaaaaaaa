"use client";

import { useEffect } from "react";

export const ResizeObserverProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Patch window.ResizeObserver with requestAnimationFrame to prevent notification loops
      const originalResizeObserver = window.ResizeObserver;
      if (
        originalResizeObserver &&
        !(originalResizeObserver as any).__isPatched
      ) {
        const PatchedResizeObserver = class extends originalResizeObserver {
          constructor(callback: ResizeObserverCallback) {
            super((entries, observer) => {
              window.requestAnimationFrame(() => {
                try {
                  callback(entries, observer);
                } catch (err: any) {
                  if (
                    err?.message?.includes("ResizeObserver loop") ||
                    err?.message?.includes("undelivered notifications")
                  ) {
                    return;
                  }
                  throw err;
                }
              });
            });
          }
        };
        (PatchedResizeObserver as any).__isPatched = true;
        window.ResizeObserver = PatchedResizeObserver;
      }

      // Suppress benign ResizeObserver loop error events from Next.js dev overlay
      const handleError = (e: ErrorEvent) => {
        if (
          e.message?.includes("ResizeObserver loop") ||
          e.message?.includes("undelivered notifications")
        ) {
          e.stopImmediatePropagation();
          e.preventDefault();
          return true;
        }
      };

      window.addEventListener("error", handleError);
      return () => {
        window.removeEventListener("error", handleError);
      };
    }
  }, []);

  return <>{children}</>;
};
