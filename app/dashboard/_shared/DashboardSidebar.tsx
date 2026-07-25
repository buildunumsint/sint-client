"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { X } from "lucide-react";
import SidebarNav from "./SidebarNav";
import { DASHBOARD_BOTTOM_NAV, DASHBOARD_NAV } from "../nav";
import UnumSintIcon from "./icons/UnumSintIcon";
import Divider from "@/components/ui/divider";

export default function DashboardSidebar({
  mobile,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthContext();
  const section = pathname.split("/")[2] ?? "";

  return (
    <aside
      className={[
        "h-full w-[280px] shrink-0 bg-[#F7F7F7]",
        "border-r border-zinc-200/70",
        "px-8 py-8",
        mobile ? "rounded-2xl shadow-2xl shadow-black/10" : "",
      ].join(" ")}
      aria-label="Sidebar navigation"
    >
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <UnumSintIcon />
          <span className="text-base font-semibold tracking-tight">
            Unum Sint
          </span>
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <Divider className="my-6" />

      <SidebarNav
        key={`main-${section}`}
        items={DASHBOARD_NAV}
        onNavigate={mobile ? onClose : undefined}
      />

      <div className="mt-8 border-t border-zinc-200/70 pt-4">
        <SidebarNav
          items={DASHBOARD_BOTTOM_NAV}
          onNavigate={mobile ? onClose : undefined}
        />
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-zinc-200/70 bg-linear-to-br from-violet-50 to-white p-4">
          <p className="text-sm font-semibold text-zinc-900">Need help?</p>
          <p className="mt-1 text-xs text-zinc-600">
            Email us at <a href="mailto:buildunumsint@gmail.com" className="underline">buildunumsint@gmail.com</a> for help.
          </p>
          
        </div>

        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
