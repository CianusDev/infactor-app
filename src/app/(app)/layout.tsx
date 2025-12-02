import { AppSidebar } from "@/components/shared/sidebar/app-sidebard";
import { ModeToggle } from "@/components/shared/toggle-theme";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/services/session.service";
import { redirect } from "next/navigation";
import { routes } from "@/server/config/routes";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session.isAuthenticated || !session.data) {
    redirect(routes.auth.login);
  }

  const user = {
    id: session.data.id,
    firstName: session.data.firstName,
    lastName: session.data.lastName,
    email: session.data.email,
    avatar: null,
  };

  return (
    <main className="bg-background">
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset className="px-2">
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
            </div>
            <div className="px-4">
              <ModeToggle />
            </div>
          </header>
          <main className="flex flex-col h-[calc(100svh-64px)] bg-muted/50 overflow-auto p-4 border rounded-xl">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
