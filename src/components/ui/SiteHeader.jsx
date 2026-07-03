"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floatingnavbar";
import { AnimatedTooltip } from "@/components/ui/animatedtooltip";
import MobileNav from "@/components/ui/MobileNav";
import { navItems, profileItem, socialIcons as defaultSocialIcons } from "@/lib/siteNav";

export default function SiteHeader() {
  const pathname = usePathname();
  const [resumeNavHref, setResumeNavHref] = useState(null);

  const loadResumeNav = useCallback(() => {
    fetch("/api/resume", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && json.navHref) {
          setResumeNavHref(json.navHref);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadResumeNav();

    const onFocus = () => loadResumeNav();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [pathname, loadResumeNav]);

  const socialIcons = useMemo(() => {
    return defaultSocialIcons.map((icon) => {
      if (icon.name !== "Resume") return icon;
      return { ...icon, link: resumeNavHref || icon.link };
    });
  }, [resumeNavHref]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const hideCenterNav = pathname === "/about/journey";

  return (
    <header className="fixed top-4 sm:top-6 lg:top-12 inset-x-0 z-[5000] px-3 sm:px-6 lg:px-10 pointer-events-none">
      <div className="relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between pointer-events-auto">
        <div className="relative z-10 w-12 sm:w-14 shrink-0">
          <AnimatedTooltip items={[profileItem]} />
        </div>

        {!hideCenterNav && (
          <div className="absolute left-1/2 top-1/2 z-20 hidden lg:block -translate-x-1/2 -translate-y-1/2">
            <FloatingNav navItems={navItems} inline />
          </div>
        )}

        <div className="relative z-10 flex items-center justify-end gap-2 shrink-0">
          <div className="hidden lg:flex w-[10.5rem] justify-end">
            <AnimatedTooltip icons={socialIcons} spaced />
          </div>
          <div className="lg:hidden">
            <MobileNav socialIcons={socialIcons} />
          </div>
        </div>
      </div>
    </header>
  );
}
