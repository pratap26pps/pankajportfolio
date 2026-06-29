"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navItems, socialIcons } from "@/lib/siteNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Image from "next/image";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-black/85 backdrop-blur-md shadow-sm text-neutral-800 dark:text-white"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="lg:hidden fixed inset-0 z-[6000]">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={closeMenu}
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="absolute top-0 right-0 flex h-full w-[min(100vw,18.5rem)] flex-col bg-white dark:bg-neutral-950 shadow-2xl border-l border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  PPS
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.link.startsWith("/#") && pathname === "/"
                      ? false
                      : item.link === pathname ||
                        (item.link.startsWith("/") && !item.link.includes("#") && pathname === item.link);

                  return (
                    <li key={item.link}>
                      <Link
                        href={item.link}
                        onClick={closeMenu}
                        className={`flex min-h-[48px] items-center rounded-xl px-4 text-[15px] font-medium transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                            : "text-neutral-700 dark:text-neutral-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-neutral-200 dark:border-neutral-800 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Theme</p>
                  <ThemeToggle />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">Connect</p>
                  <div className="flex flex-wrap gap-2.5">
                    {socialIcons.map((icon) => (
                      <a
                        key={icon.name}
                        href={icon.link}
                        target={icon.link.startsWith("http") ? "_blank" : undefined}
                        rel={icon.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        aria-label={icon.name}
                        onClick={closeMenu}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-indigo-400/50 transition-colors"
                      >
                        <Image
                          src={icon.image}
                          alt={icon.name}
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
