"use client";

import { Search } from "lucide-react";
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SidebarHeader } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { SidebarData } from "./types";
import { Logo } from "@/components/shared/logo";

interface NavHeaderProps {
  data: SidebarData;
}

export function NavHeader({ data }: NavHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Logo />
        </div>
        <div
          className="flex items-center justify-between px-3 py-2 cursor-pointer rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center flex-1 gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-normal">
              Rechercher...
            </span>
          </div>
          <div className="flex items-center justify-center px-1.5 py-0.5 border border-border rounded text-muted-foreground">
            <kbd className="inline-flex font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
          </div>
        </div>
      </SidebarHeader>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {data.navMain.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item.url)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          {data.quickActions && data.quickActions.length > 0 && (
            <CommandGroup heading="Actions rapides">
              {data.quickActions.map((action) => (
                <CommandItem
                  key={action.id}
                  onSelect={() => handleSelect(action.href)}
                  className="cursor-pointer"
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  <span>{action.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
