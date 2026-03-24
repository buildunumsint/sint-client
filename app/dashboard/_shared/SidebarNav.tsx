"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardNavItem } from "../nav";
import { sacramentNameFromType, useSacramentTypesContext } from "@/context/prefetch/SacramentTypesContext";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// function humanizeSacramentType(value: string) {
//   return value
//     .trim()
//     .replace(/[-_]+/g, " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());
// }

export default function SidebarNav({
  items,
  onNavigate,
}: {
  items: DashboardNavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { sacramentTypes } = useSacramentTypesContext();
  const [archiveOpen, setArchiveOpen] = useState(() =>
    pathname === "/dashboard/archive" || pathname.startsWith("/dashboard/archive/"),
  );

  const archiveSubItems = sacramentTypes.map((s) => ({
    label: sacramentNameFromType(s.sacrament_type as SacramentType),
    href: `/dashboard/archive/${encodeURIComponent(s.sacrament_type)}`,
  }));

  return (
    <nav className="gap-4 flex flex-col">
      {items.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        const isArchive = item.href === "/dashboard/archive";
        return (
          <div key={item.href} className="flex flex-col">
            {isArchive ? (
              <div
                className={cx(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition m-0",
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-violet-600/20"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                )}
              >
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setArchiveOpen((v) => !v);
                  }}
                  className={cx(
                    "inline-flex h-8 w-8 items-center justify-center rounded-md transition",
                    isActive ? "hover:bg-white/15" : "hover:bg-zinc-200/60",
                  )}
                  aria-label={archiveOpen ? "Collapse Archive menu" : "Expand Archive menu"}
                  aria-expanded={archiveOpen}
                  aria-controls="archive-submenu"
                >
                  <ChevronDown
                    className={cx(
                      "h-4 w-4 transition-transform",
                      archiveOpen ? "rotate-180" : "",
                    )}
                  />
                </button>
              </div>
            ) : (
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cx(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition m-0",
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-violet-600/20"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )}

            {isArchive && archiveOpen && (
              <div id="archive-submenu" className="ml-9 mt-2 flex flex-col gap-1">
                {archiveSubItems.length > 0 ? (
                  archiveSubItems.map((sub) => {
                    const isSubActive =
                      pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onNavigate}
                        className={cx(
                          "rounded-md px-3 py-2 text-sm transition",
                          isSubActive
                            ? "border border-purple-700"
                            : "text-zinc-60",
                        )}
                      >
                        {sub.label}
                      </Link>
                    );
                  })
                ) : (
                  <span className="px-3 py-2 text-sm text-zinc-400">Loading…</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

