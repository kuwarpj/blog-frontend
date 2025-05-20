import { Inbox } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: Inbox,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="bg-white border-r border-gray-200 min-h-screen w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold text-lg px-6 py-7 border-b border-gray-200">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-6 py-5 mt-1 rounded-md text-gray-700 hover:bg-indigo-600 hover:text-black transition-colors w-full"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
