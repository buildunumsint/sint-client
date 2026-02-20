"use client";

import { Bell, Menu, Search, Settings } from "lucide-react";
import Image from "next/image";

export default function DashboardTopbar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-zinc-50/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/50">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-5 lg:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200/70 hover:bg-zinc-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden text-xl font-semibold text-zinc-900 lg:block">
          Dashboard
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <div className="relative hidden w-full max-w-[420px] lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              placeholder="Search"
              className="h-10 w-full rounded-2xl bg-white pl-10 pr-4 text-sm text-zinc-900 shadow-sm ring-1 ring-zinc-200/70 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200/70 hover:bg-zinc-50"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200/70 hover:bg-zinc-50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="h-10 w-10 overflow-hidden rounded-2xl bg-zinc-200 ring-1 ring-zinc-200/70">
            <Image
              src="/Unum_Logo.svg"
              alt="Profile"
              width={40}
              height={40}
              className="h-10 w-10 object-cover p-2"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

