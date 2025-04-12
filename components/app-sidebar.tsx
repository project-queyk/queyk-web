"use client";

import Image from "next/image";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import {
  AlignLeft,
  BookOpen,
  ChevronsUpDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

export function AppSidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <Sidebar className="border-none">
      <SidebarContent className="p-2">
        <SidebarGroup>
          <div className="mb-6 flex items-center justify-between">
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
            <div className="size-5"></div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex h-full w-full cursor-pointer items-center gap-2 py-3">
                  <Image
                    src={session.user?.image ?? ""}
                    alt={`${session.user?.name}'s profile image`}
                    width={50}
                    height={50}
                    className="size-8 rounded-full"
                  />
                  <div className="w-full overflow-hidden">
                    <p className="overflow-hidden text-sm font-bold text-ellipsis whitespace-nowrap">
                      {session.user?.name}
                    </p>
                    <p className="text-muted overflow-hidden text-xs font-medium text-ellipsis whitespace-nowrap">
                      {session.user?.email}
                    </p>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="border-sidebar-border text-sidebar-foreground w-full bg-[#17335d] p-0"
              >
                <SidebarMenu className="hover:bg-sidebar">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
