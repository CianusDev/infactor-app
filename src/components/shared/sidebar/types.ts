import type { ElementType } from "react";

export interface NavItem {
  id: string;
  title: string;
  icon: ElementType;
  url: string;
  isActive?: boolean;
  badge?: string | number;
}

export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  avatar?: string | null;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: ElementType;
  href: string;
}

export interface SidebarData {
  user: User;
  navMain: NavItem[];
  quickActions?: QuickAction[];
}
