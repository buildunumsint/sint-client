import type { Metadata } from "next";
import DashboardShell from "./_shared/DashboardShell";
import DashboardProviders from "./_shared/DashboardProviders";

export const metadata: Metadata = {
  title: "Dashboard • Unum Sint",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProviders>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProviders>
  );
}

