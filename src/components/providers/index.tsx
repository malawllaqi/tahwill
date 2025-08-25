"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "../ui/sonner";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Toaster />
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}
