import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/services/socketService";
import { useChatStore } from "@/store/useChatStore";

const ChatPage = () => {
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    connectSocket();
    fetchConversations();
    
    return () => {
      disconnectSocket();
    };
  }, [fetchConversations]);
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ChatWindowLayout />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default ChatPage;
