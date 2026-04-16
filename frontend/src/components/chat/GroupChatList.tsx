import { useChatStore } from "@/store/useChatStore";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

const GroupChatList = () => {
  const { conversations, selectConversation, selectedConversation } = useChatStore();

  const groupConversations = conversations.filter(c => c.type === "group");

  if (groupConversations.length === 0) {
    return <div className="px-4 py-2 text-sm text-sidebar-foreground/50">Chưa có nhóm nào</div>;
  }

  return (
    <SidebarMenu>
      {groupConversations.map((conv) => {
        const displayName = conv.name || "Nhóm không tên";
        
        let lastMsgText = "Chưa có tin nhắn";
        if (conv.lastMessage) {
          if (typeof conv.lastMessage === "string") {
             lastMsgText = "Tin nhắn mới";
          } else {
             lastMsgText = conv.lastMessage.type === "text" ? conv.lastMessage.content : `[${conv.lastMessage.type}]`;
          }
        }

        const timeFormat = new Intl.DateTimeFormat('vi-VN', { hour: 'numeric', minute: 'numeric' }).format(new Date(conv.updatedAt));
        const memberCount = conv.participants.length;

        return (
          <SidebarMenuItem key={conv._id}>
            <SidebarMenuButton 
              isActive={selectedConversation?._id === conv._id}
              onClick={() => selectConversation(conv)}
              size="lg"
              className="mb-2 bg-sidebar h-auto p-3 hover:bg-sidebar-accent/50 rounded-2xl shadow-sm border border-sidebar-border/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex -space-x-3 shrink-0">
                  {/* Stack 3 avatars mượn tạm */}
                  <Avatar className="h-9 w-9 border-2 border-sidebar-background z-30">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">U1</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-9 w-9 border-2 border-sidebar-background z-20">
                    <AvatarFallback className="bg-primary/40 text-primary-foreground text-xs">U2</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-9 w-9 border-2 border-sidebar-background z-10">
                    <AvatarFallback className="bg-primary/60 text-primary-foreground text-xs">U3</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col overflow-hidden text-left max-w-[120px]">
                  <span className="font-bold text-[13px] leading-tight mb-1 truncate text-foreground">{displayName}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{memberCount} thành viên</span>
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

export default GroupChatList;
