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
              className='border-2 rounded-lg border-sidebar-border bg-sidebar-primary'
            >
              <a href='#'>
                <div className='flex items-center justify-between w-full px-2'>
                  <h1 className='text-xl font-bold text-white'>Halo</h1>
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
        <SidebarGroup title='New Chat'>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>
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
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
