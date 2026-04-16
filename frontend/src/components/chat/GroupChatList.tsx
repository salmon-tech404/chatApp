import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { Participant } from "@/types/chat";

const GroupChatList = () => {
  const { conversations, selectConversation, selectedConversation, unreadCounts } = useChatStore();
  const { user } = useAuthStore();

  const groupConversations = conversations.filter((c) => c.type === "group");

  if (groupConversations.length === 0) {
    return (
      <div className="px-4 py-3 text-center">
        <p className="text-xs text-sidebar-foreground/40">Chưa có nhóm nào</p>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {groupConversations.map((conv) => {
        const displayName = conv.name || "Nhóm không tên";
        const isActive = selectedConversation?._id === conv._id;
        const unread = unreadCounts[conv._id] ?? 0;

        const participantObjects = conv.participants.filter(
          (p): p is Participant => typeof p !== "string",
        );
        const others = participantObjects.filter((p) => p._id !== user?._id);
        const avatarsToShow = (others.length > 0 ? others : participantObjects).slice(0, 2);

        let lastMsgText = "Chưa có tin nhắn";
        if (conv.lastMessage) {
          if (typeof conv.lastMessage === "string") {
            lastMsgText = "Tin nhắn mới";
          } else {
            lastMsgText =
              conv.lastMessage.type === "text"
                ? conv.lastMessage.content
                : conv.lastMessage.type === "image"
                  ? "[Hình ảnh]"
                  : "[Tệp đính kèm]";
          }
        }

        const timeFormat = new Intl.DateTimeFormat("vi-VN", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(conv.updatedAt));

        return (
          <SidebarMenuItem key={conv._id}>
            <SidebarMenuButton
              isActive={isActive}
              onClick={() => selectConversation(conv)}
              size="lg"
              className={`mb-1.5 h-auto p-3 rounded-2xl border transition-all ${
                isActive
                  ? "bg-[#2dd4bf]/10 border-[#2dd4bf]/25 shadow-sm"
                  : unread > 0
                    ? "bg-sidebar border-[#2dd4bf]/20 hover:bg-sidebar-accent/60"
                    : "bg-sidebar border-sidebar-border/30 hover:bg-sidebar-accent/60 hover:border-sidebar-border/60"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden w-full">
                {/* Stacked Avatars */}
                <div className="relative shrink-0 h-10 w-10 flex items-center justify-center">
                  {avatarsToShow.length === 0 ? (
                    <div className="h-10 w-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#2dd4bf]/70" />
                    </div>
                  ) : (
                    <div className="flex -space-x-2.5">
                      {avatarsToShow.map((p, i) => (
                        <Avatar
                          key={p._id}
                          className={`h-7 w-7 border-2 border-sidebar ${i === 0 ? "z-20" : "z-10"}`}
                        >
                          <AvatarImage src={p.avatarUrl} />
                          <AvatarFallback className="text-[10px] bg-gradient-to-br from-[#2dd4bf]/25 to-[#0ea5e9]/25 text-[#0ea5e9] font-semibold">
                            {p.displayName?.charAt(0).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                  {/* Badge số thành viên */}
                  <div className="absolute -bottom-1 -right-1 h-4 min-w-4 px-0.5 rounded-full bg-[#0ea5e9] text-white text-[9px] font-bold flex items-center justify-center border-2 border-sidebar">
                    {conv.participants.length}
                  </div>
                </div>

                {/* Text info */}
                <div className="flex flex-col flex-1 overflow-hidden text-left min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-bold text-[13px] leading-tight truncate ${isActive ? "text-[#2dd4bf]" : "text-foreground"}`}>
                      {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{timeFormat}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className={`text-[11px] truncate ${unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {lastMsgText}
                    </span>
                    {/* Unread badge */}
                    {unread > 0 && !isActive && (
                      <span className="shrink-0 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#0ea5e9] text-white text-[9px] font-bold flex items-center justify-center">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default GroupChatList;
