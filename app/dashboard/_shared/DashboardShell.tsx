"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { dynamicPaths } from "@/lib/constants/paths";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { access_token } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Basic guard: if not authenticated, bounce to login.
    // (You can replace this later with a real session check.)
    if (!access_token) router.replace(dynamicPaths(null).auth.login());
  }, [access_token, router]);

  useEffect(() => {
    // Close mobile sidebar on route change.
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      )}

      <div className="mx-auto flex min-h-screen w-full">
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed left-4 top-4 z-40 lg:hidden">
            <DashboardSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar onOpenSidebar={() => setSidebarOpen(true)} />

          <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-12 pt-8 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

