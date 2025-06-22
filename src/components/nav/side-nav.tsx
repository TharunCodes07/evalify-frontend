"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  Book,
  Building,
  CalendarDays,
  FileText,
  LogOut,
  User,
  Users,
  Users2,
  Zap,
  ChevronsUpDown,
  Home,
  Archive,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/nav/theme-toggle";

interface NavItem {
  title: string;
  icon: React.ElementType;
  url: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
    roles: ["admin", "faculty", "student", "manager"],
  },
  {
    title: "Users",
    icon: Users,
    url: "/user",
    roles: ["admin"],
  },
  {
    title: "Semester",
    icon: CalendarDays,
    url: "/semester",
    roles: ["admin"],
  },
  {
    title: "Batch",
    icon: Users2,
    url: "/batch",
    roles: ["admin"],
  },
  {
    title: "Department",
    icon: Building,
    url: "/department",
    roles: ["admin"],
  },
  {
    title: "Reviews",
    icon: FileText,
    url: "/reviews",
    roles: ["admin", "faculty", "manager"],
  },
  {
    title: "Teams",
    icon: Users,
    url: "/teams",
    roles: ["admin", "student", "manager"],
  },
  {
    title: "Courses",
    icon: Book,
    url: "/courses",
    roles: ["faculty", "manager", "student"],
  },
  {
    title: "Archives",
    icon: Archive,
    url: "/archives",
    roles: ["faculty", "student"],
  },
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const accessibleNavItems = React.useMemo(() => {
    if (!session?.user?.groups?.length) return [];

    return navItems.filter((item) =>
      item.roles.some((role) =>
        (session.user.groups as string[]).includes(role)
      )
    );
  }, [session?.user?.groups]);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <Zap className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-lg">Devlabs</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Project Management
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <ThemeToggle />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {accessibleNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={32}
                          height={32}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <AvatarFallback className="rounded-lg">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {session?.user?.email || "user@example.com"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        {session?.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            width={32}
                            height={32}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <AvatarFallback className="rounded-lg">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session?.user?.name || "User"}
                        </span>
                        <span className="truncate text-xs">
                          {session?.user?.email || "user@example.com"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />{" "}
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await signOut({
                          redirect: true,
                          callbackUrl: "/login",
                        });
                      } catch (error) {
                        console.error("Error during logout:", error);
                        // Fallback: still redirect to login even if logout fails
                        window.location.href = "/login";
                      }
                    }}
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </>
  );
}
