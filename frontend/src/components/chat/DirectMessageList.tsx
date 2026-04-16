import { useChatStore } from "@/store/useChatStore";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import type { Participant } from "@/types/chat";

const DirectMessageList = () => {
  const { conversations, selectConversation, selectedConversation } = useChatStore();
  const { user } = useAuthStore();

  const directConversations = conversations.filter(c => c.type === "direct");

  if (directConversations.length === 0) {
    return <div className="px-4 py-2 text-sm text-sidebar-foreground/50">Chưa có cuộc trò chuyện nào</div>;
  }

  return (
    <SidebarMenu>
      {directConversations.map((conv) => {
        // Tìm participant không phải là user hiện tại
        const otherParticipant = conv.participants.find(
          (p) => typeof p !== "string" && p._id !== user?._id
        ) as Participant | undefined;

        const displayName = otherParticipant?.displayName || "Unknown User";
        const avatarUrl = otherParticipant?.avatarUrl;
        
        let lastMsgText = "Chưa có tin nhắn";
        if (conv.lastMessage) {
          if (typeof conv.lastMessage === "string") {
             lastMsgText = "Tin nhắn mới";
          } else {
             lastMsgText = conv.lastMessage.type === "text" ? conv.lastMessage.content : `[${conv.lastMessage.type}]`;
          }
        }

        const timeFormat = new Intl.DateTimeFormat('vi-VN', { hour: 'numeric', minute: 'numeric' }).format(new Date(conv.updatedAt));

        return (
          <SidebarMenuItem key={conv._id}>
            <SidebarMenuButton 
              isActive={selectedConversation?._id === conv._id}
              onClick={() => selectConversation(conv)}
              size="lg"
              className="mb-2 bg-sidebar h-[68px] p-3 hover:bg-sidebar-accent/50 rounded-2xl shadow-sm border border-sidebar-border/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10 border border-sidebar-border">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {/* Chấm xanh Online (Giả định) */}
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-sidebar shadow-sm"></div>
                </div>
                <div className="flex flex-col overflow-hidden text-left max-w-[120px]">
                  <span className="font-bold text-[14px] leading-tight mb-0.5 truncate text-foreground group-hover:text-primary transition-colors">{displayName}</span>
                  <span className="text-[12px] text-muted-foreground truncate">{lastMsgText}</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-2 self-start pt-1">{timeFormat}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default DirectMessageList;
