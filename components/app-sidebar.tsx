"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AlignLeft,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOutIcon,
  MapPin,
  PanelLeftIcon,
} from "lucide-react";

import { signOutAction } from "@/lib/auth-actions";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Evacuation Plan",
    url: "/evacuation-plan",
    icon: MapPin,
  },
  {
    title: "Protocols",
    url: "/protocols",
    icon: ClipboardList,
  },
  {
    title: "User Manual",
    url: "/user-manual",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <Sidebar className="border-none">
      <SidebarContent className="p-2">
        <SidebarGroup>
          <div
            className={`mb-6 flex items-center ${isMobile ? "gap-12" : "gap-10"}`}
          >
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="hover:bg-sidebar-accent size-6 cursor-pointer"
            >
              {isMobile ? (
                <AlignLeft className="text-primary-foreground size-5 transition-colors hover:text-white" />
              ) : (
                <PanelLeftIcon className="text-primary-foreground size-5 transition-colors hover:text-white" />
              )}
            </Button>
            <div className="flex items-center">
              <Image
                src="/queyk-light.png"
                width={25}
                height={25}
                alt="queyk's logo"
              />
              <SidebarGroupLabel className="text-background mb-0.5 -ml-1 text-xl font-semibold">
                Queyk
              </SidebarGroupLabel>
            </div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url} className="py-6">
                      <item.icon size={64} />
                      <span
                        className={`mb-[1px] ${
                          pathname === item.url
                            ? "font-semibold"
                            : "font-medium"
                        } `}
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={signOutAction}
                className="h-full cursor-pointer py-3"
              >
                <LogOutIcon size={64} />
                <span className="mb-[1px] font-medium">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
