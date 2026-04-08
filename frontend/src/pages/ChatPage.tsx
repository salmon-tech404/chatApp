import App from "@/App";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatPage = () => {
  return (
    <SidebarProvider>
      <App>
        <div className='flex h-screen'>
          <AppSidebar />
          <ChatWindowLayout />
          <p>CHAT APP PAGE</p>
          <p>CHAT APP PAGE</p>
          <p>CHAT APP PAGE</p>
          <p>CHAT APP PAGE</p>
        </div>
      </App>
    </SidebarProvider>
  );
};

export default ChatPage;
