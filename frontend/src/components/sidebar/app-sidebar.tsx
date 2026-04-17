"use client";
import * as React from "react";

import CreateNewChat from "@/components/chat/CreateNewChat";
import GroupChatList from "@/components/chat/GroupChatList";
import DirectMessageList from "@/components/chat/DirectMessageList";
import NewGroupChatModel from "@/components/chat/NewGroupChatModel";
import AddFriendModel from "@/components/chat/AddFriendModel";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Sun, Moon, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();

  return (
    <Sidebar variant="inset" {...props}>
      {/* ── Header ─────────────────────────────────────── */}
      <SidebarHeader className="pb-2">
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-[#1c2842] to-[#1c3a55] shadow-md">
          <span className="text-2xl font-black text-white tracking-tight">Halo</span>
          <div className="flex items-center gap-2">
            <Sun className="text-white/60 size-3.5" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
              className="scale-90 data-[state=checked]:bg-white/25"
            />
            <Moon className="text-white/60 size-3.5" />
          </div>
        </div>
      </SidebarHeader>

      {/* ── Body ───────────────────────────────────────── */}
      <SidebarContent>
        {/* New Chat button */}
        <div className="px-3 mt-1">
          <CreateNewChat />
        </div>

        {/* Add Friend / Search User button */}
        <div className="px-3">
          <AddFriendModel asButton />
        </div>

        {/* Group Chats */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground/60">
            Nhóm Chat
          </SidebarGroupLabel>
          <SidebarGroupAction className="cursor-pointer !w-7 !h-7" title="Tạo nhóm mới">
            <NewGroupChatModel />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Messages / Friends */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground/60">
            Bạn Bè
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <DirectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer – Real User Info ─────────────────────── */}
      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-sidebar-accent/40 border border-sidebar-border/30 group hover:bg-sidebar-accent/70 transition-colors">
          {/* Avatar */}
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-[#2dd4bf]/30">
            <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
            <AvatarFallback className="bg-gradient-to-br from-[#2dd4bf] to-[#0ea5e9] text-white font-bold text-sm">
              {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="font-semibold text-sm leading-tight truncate text-foreground">
              {user?.displayName ?? "Người dùng"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
              <span className="text-[11px] text-muted-foreground truncate">
                @{user?.username ?? "unknown"}
              </span>
            </div>
          </div>

          {/* Logout – visible on hover */}
          <button
            onClick={() => signOut()}
            title="Đăng xuất"
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
