import type { Metadata } from "next";
import DashboardShell from "./_shared/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard • Unum Sint",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}

