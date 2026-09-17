"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  BookOpen,
  BarChart3,
  Settings,
  Search,
  Inbox,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "AGENT", "VIEWER"] },
  { label: "Tickets", href: "/tickets", icon: Ticket, roles: ["ADMIN", "MANAGER", "AGENT", "VIEWER"] },
  { label: "Knowledge Base", href: "/knowledge-base", icon: BookOpen, roles: ["ADMIN", "MANAGER", "AGENT", "VIEWER"] },
  { label: "Analytics", href: "/analytics", icon: BarChart3, roles: ["ADMIN", "MANAGER"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["ADMIN", "MANAGER"] },
  { label: "Search KB", href: "/knowledge-base/search", icon: Search, roles: ["ADMIN", "MANAGER", "AGENT", "VIEWER"] },
  { label: "AI Inbox", href: "/ai-inbox", icon: Inbox, roles: ["ADMIN", "MANAGER", "AGENT"] },
  { label: "AI Performance", href: "/ai-performance", icon: TrendingUp, roles: ["ADMIN", "MANAGER"] },
];

export function NavLinks({
  role,
  onNavigate,
}: {
  role?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) =>
    role ? item.roles.includes(role) : true
  );

  return (
    <nav className="flex-1 space-y-1 p-3">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ role }: { role?: string }) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold">NEXUS</span>
      </div>
      <NavLinks role={role} />
    </aside>
  );
}