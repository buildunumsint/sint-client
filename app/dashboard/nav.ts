import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BookOpen,
  Bot,
  Boxes,
  Gamepad2,
  LayoutDashboard,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Archive", href: "/dashboard/archive", icon: Archive },
  { label: "Readings", href: "/dashboard/readings", icon: BookOpen },
  {
    label: "Pastoral Letters",
    href: "/dashboard/pastoral-letters",
    icon: ScrollText,
  },
  { label: "Chatbot", href: "/dashboard/chatbot", icon: Bot },
  // { label: "Meme School", href: "/dashboard/meme-school", icon: Boxes },
  // { label: "Community", href: "/dashboard/community", icon: Users },
  // { label: "Games", href: "/dashboard/games", icon: Gamepad2 },
];

export const DASHBOARD_BOTTOM_NAV: DashboardNavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

