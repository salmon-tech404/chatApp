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
            <SidebarMenuButton size='lg' asChild className='sidebar-primary'>
              <a href='#'>
                <div className='flex items-center justify-between w-full px-2'>
                  <h1 className='text-xl font-bold text-white'>Halo</h1>
                  <div className='flex items-center gap-2'>
                    <Sun className='text-white size-4' />
                    <Switch
                      checked={true}
                      onCheckedChange={() => {}}
                      className='data-[state=checked]:bg-background'
                    />
                    <Moon className='text-white size-4' />
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
