"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The white column in the middle of the gray page, like Gates Notes. Project pages (/projects/{name}) are the
 * exception: they run edge to edge so the opening screen, scenes and footer fill the whole window.
 */
export default function PageFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const fullWidth = /^\/projects\/[^/]+/.test(pathname);

  return <div className={`${fullWidth ? "" : "max-w-[1500px] mx-auto"} bg-white min-h-screen flex flex-col`}>{children}</div>;
}
