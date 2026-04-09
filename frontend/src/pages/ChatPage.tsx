import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";

const ChatPage = () => {
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
