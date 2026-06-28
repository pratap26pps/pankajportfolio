"use client";

import { usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floatingnavbar";
import { AnimatedTooltip } from "@/components/ui/animatedtooltip";
import { navItems, profileItem, socialIcons } from "@/lib/siteNav";

export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const hideCenterNav = pathname === "/about/journey";

  return (
    <header className="fixed top-8 lg:top-12 inset-x-0 z-[5000] px-4 sm:px-6 lg:px-10 pointer-events-none">
      <div className="relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between pointer-events-auto">
        <div className="relative z-10 w-14 shrink-0">
          <AnimatedTooltip items={[profileItem]} />
        </div>

        {!hideCenterNav && (
          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <FloatingNav navItems={navItems} inline />
          </div>
        )}

        <div className="relative z-10 w-[9.5rem] sm:w-[10.5rem] shrink-0 flex justify-end">
          <AnimatedTooltip icons={socialIcons} spaced />
        </div>
      </div>
    </header>
  );
}
