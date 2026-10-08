"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const stagger = ".rooms > *, .project-grid > *, .points > li, .price-list > li, .deal";

export function Reveal() {
  const path = usePathname();

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = document.querySelectorAll<HTMLElement>("main .section, main .page-head, .foot");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle("is-in", entry.isIntersecting);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const node of nodes) {
      node.querySelectorAll<HTMLElement>(stagger).forEach((child, index) => {
        child.style.setProperty("--i", String(Math.min(index, 8)));
      });
      node.classList.add("reveal");
      observer.observe(node);
    }
    return () => observer.disconnect();
  }, [path]);

  return null;
}
