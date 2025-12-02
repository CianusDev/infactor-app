"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Settings,
  Building2,
  Palette,
} from "lucide-react";
import { NavFooter } from "./nav-footer";
import { NavHeader } from "./nav-header";
import { NavMain } from "./nav-main";
import type { NavItem, QuickAction, SidebarData } from "./types";
import { routes } from "@/server/config/routes";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const navItems: NavItem[] = [
  {
    id: "dashboard",
    title: "Tableau de bord",
    url: routes.app.home,
    icon: LayoutDashboard,
  },
  {
    id: "invoices",
    title: "Factures",
    url: "/invoices",
    icon: FileText,
  },
  {
    id: "templates",
    title: "Modèles",
    url: "/templates",
    icon: Palette,
  },
  {
    id: "business-profile",
    title: "Mon entreprise",
    url: routes.app.settings.business,
    icon: Building2,
  },
  {
    id: "settings",
    title: "Paramètres",
    url: routes.app.settings.profile,
    icon: Settings,
  },
];

const quickActions: QuickAction[] = [
  {
    id: "new-invoice",
    title: "Nouvelle facture",
    icon: Plus,
    href: routes.app.invoices.new,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    avatar?: string | null;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();

  // Marquer l'item actif en fonction de l'URL
  const navItemsWithActive = useMemo(() => {
    return navItems.map((item) => ({
      ...item,
      isActive:
        pathname === item.url ||
        (item.url !== routes.app.home && pathname.startsWith(item.url)),
    }));
  }, [pathname]);

  const data: SidebarData = {
    user: user || {
      id: "",
      firstName: "Utilisateur",
      lastName: "",
      email: "user@example.com",
      avatar: null,
    },
    navMain: navItemsWithActive,
    quickActions,
  };

  return (
    <Sidebar className="border-none" {...props}>
      <NavHeader data={data} />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <NavFooter user={data.user} quickActions={data.quickActions} />
    </Sidebar>
  );
}
