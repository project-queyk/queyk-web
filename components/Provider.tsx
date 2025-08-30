"use client";

import React from "react";
import QueryProvider from "@/contexts/QueryProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
