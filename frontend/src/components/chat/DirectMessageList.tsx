import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOnlineStore } from "@/store/useOnlineStore";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Participant } from "@/types/chat";

const DirectMessageList = () => {
  const { conversations, selectConversation, selectedConversation, unreadCounts } = useChatStore();
  const { user } = useAuthStore();
  const onlineUserIds = useOnlineStore((state) => state.onlineUserIds);

  const directConversations = conversations.filter((c) => c.type === "direct");

  if (directConversations.length === 0) {
    return (
      <div className="px-4 py-3 text-center">
        <p className="text-xs text-sidebar-foreground/40">Chưa có cuộc trò chuyện nào</p>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {directConversations.map((conv) => {
        const otherParticipant = conv.participants.find(
          (p): p is Participant => typeof p !== "string" && p._id !== user?._id,
        );

        const displayName = otherParticipant?.displayName || "Unknown User";
        const avatarUrl = otherParticipant?.avatarUrl;
        const online = otherParticipant ? onlineUserIds.includes(otherParticipant._id) : false;
        const unread = unreadCounts[conv._id] ?? 0;
        const isActive = selectedConversation?._id === conv._id;

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
                {/* Avatar + online dot */}
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10 border border-sidebar-border">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-[#2dd4bf]/15 text-[#0ea5e9] font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online/Offline dot — thực từ socket */}
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sidebar shadow-sm ${
                      online ? "bg-green-500" : "bg-muted-foreground/30"
                    }`}
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col overflow-hidden text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`font-bold text-[14px] leading-tight truncate ${
                        isActive ? "text-[#2dd4bf]" : unread > 0 ? "text-foreground" : "text-foreground"
                      }`}
                    >
                      {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{timeFormat}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span
                      className={`text-[12px] truncate ${
                        unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground"
                      }`}
                    >
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

export default DirectMessageList;
