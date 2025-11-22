"use client";

import React from "react";
import QueryProvider from "@/contexts/QueryProvider";
import { SessionProvider } from "next-auth/react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>{children}</SessionProvider>
    </QueryProvider>
  );
}
