"use client";
import * as React from "react";

// import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex items-center justify-between w-full px-2'>
                  <h1 className='text-xl font-bold text-foreground'>Halo</h1>
                  <div className='flex items-center gap-2'>
                    <Sun className='w-5 h-5 text-muted-foreground' />
                    <Switch className='bg-gray-600' />
                    <Moon className='w-5 h-5 text-muted-foreground' />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent></SidebarContent>

      {/* Footer */}
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
