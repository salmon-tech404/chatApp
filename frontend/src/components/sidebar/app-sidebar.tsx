"use client";
import * as React from "react";

// Import components
import CreateNewChat from "@/components/chat/CreateNewChat";
import GroupChatList from "@/components/chat/GroupChatList";
import DirectMessageList from "@/components/chat/DirectMessageList";
import NewGroupChatModel from "@/components/chat/NewGroupChatModel";
import AddFriendModel from "@/components/chat/AddFriendModel";
import { useThemeStore } from "@/store/useThemeStore";

// import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDarkMode, toggleTheme } = useThemeStore();
  return (
    <Sidebar variant='inset' {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
              className='rounded-3xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md transition-all pt-2 pb-2 h-auto h-[60px]'
            >
              <a href='#'>
                <div className='flex items-center justify-between w-full px-2'>
                  <h1 className='text-2xl font-bold text-primary-foreground tracking-tight'>Halo</h1>
                  <div className='flex items-center gap-2'>
                    <Sun className='text-white size-4' />
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                      className='data-[state=checked]:bg-background/80'
                    />
                    <Moon className='text-white size-4' />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Body */}
      <SidebarContent>
        {/* New Chat */}
        <div className="px-4 mt-2">
          <CreateNewChat />
        </div>
        {/* Group Chat */}
        <SidebarGroup title='Group Chats'>
          <SidebarGroupLabel className='uppercase'>nhóm chát</SidebarGroupLabel>
          <SidebarGroupAction className='cursor-pointer' title='tạo nhóm'>
            <NewGroupChatModel />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Friend */}
        <SidebarGroup title='friends'>
          <SidebarGroupLabel className='uppercase'>bạn bè</SidebarGroupLabel>
          <SidebarGroupAction className='cursor-pointer' title='kết bạn'>
            <AddFriendModel />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className='p-4'>
         <div className='flex items-center justify-between w-full p-2 bg-sidebar-accent/50 rounded-2xl'>
            <div className='flex items-center gap-3'>
              {/* @ts-ignore - Giả lập user (sau này lấy từ auth.user) */}
              <div className='h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold'>
                 U
              </div>
              <div className='flex flex-col'>
                 <span className='font-semibold text-sm leading-tight text-foreground'>Cá nhân</span>
                 <span className='text-xs text-muted-foreground'>Online</span>
              </div>
            </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
