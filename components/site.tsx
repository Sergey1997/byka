"use client";

import { createContext, useContext } from "react";
import type { Site } from "@/lib/site";

const SiteContext = createContext<Site | null>(null);

export function SiteProvider({ site, children }: { site: Site; children: React.ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("SiteProvider missing");
  return value;
}
