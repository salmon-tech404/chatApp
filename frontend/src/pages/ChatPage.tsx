import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatPage = () => {
  return (
    <SidebarProvider>
      <div className='flex h-screen'>
        <AppSidebar />
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
};

export default ChatPage;
