"use client";

import type { ThemeProviderProps } from "next-themes";

import { ToastProvider } from "@heroui/react";
import { HeroUIProvider } from "@heroui/system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ReactNode, useState } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ReactQueryProvider>
        <ToastProvider placement="top-center" />
        <NextThemesProvider
          attribute={"class"}
          defaultTheme={"dark"}
          enableSystem={true}
        >
          {children}
        </NextThemesProvider>
      </ReactQueryProvider>
    </HeroUIProvider>
  );
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
